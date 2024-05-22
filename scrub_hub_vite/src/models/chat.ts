import { fromBase64, toBase64 } from "../base64";
import { ChatProps, MessageProps } from "../components/ChatComponent";
import { ConversationListProps, ConversationProps } from "../components/ConversationListComponent";
import Cookies from 'universal-cookie';
import { encryptKey, generateConversationKey, getPublicKeyFromBase64 } from "../encryption";
import { Anything, ErrorResult } from "./types";
const cookies = new Cookies();

export type User = { name: string, id: number };
function isUser(obj: Anything): obj is User {
	return Boolean(
		obj &&
		typeof obj.name === 'string' &&
		typeof obj.id === 'number'
	);
}

// Message level
export class OutgoingMessage {
	public constructor(private text: string, private id: number, private key: CryptoKey) { }

	private async encryptMessage() {
		const data = new TextEncoder().encode(this.text);
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, this.key, data)
		return {
			'message': toBase64(encrypted),
			'iv': toBase64(iv),
		};
	}

	public async getData() {
		return {
			...await this.encryptMessage(),
			id: this.id,
		};
	}
}

type IncomingMessageData = {
	message: string,
	username: string,
	time: string, // must be convertable to Date
	iv: string,
}
function isIncomingMessageData(obj: Anything): obj is IncomingMessageData {
	if (!(
		obj &&
		typeof obj.message === 'string' &&
		typeof obj.username === 'string' &&
		typeof obj.time === 'string' &&
		typeof obj.iv === 'string'
	))
		return false;

	return !isNaN(new Date(obj.time).valueOf());
}

class IncomingMessage {
	public constructor(private data: IncomingMessageData, private key: CryptoKey) { }

	private async decryptMessage() {
		if (this.data.iv.length == 0) // old message, not encrypted
			return this.data.message;

		const iv = fromBase64(this.data.iv);
		const msg = fromBase64(this.data.message);
		const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, this.key, msg);
		return new TextDecoder().decode(decrypted);
	}

	public async toProps(): Promise<MessageProps> {
		return {
			message: await this.decryptMessage(),
			username: this.data.username,
			time: new Date(this.data.time),
			unconfirmed: false, // If we have received it, that means it is confirmed.
		};
	}
}

type WSMessage = {
	message?: IncomingMessage
	received?: number
}
export function parseWebSocketMessage(json: string, key: CryptoKey): WSMessage | ErrorResult {
	const parsed = JSON.parse(json);
	if (typeof parsed.received === 'number') {
		return { received: parsed.received };
	} else if (isIncomingMessageData(parsed))
		return { message: new IncomingMessage(parsed, key) };
	else
		return { error: 'invalid data received' };
}

// Conversation level
async function getConversationKeyFromBase64(dataBase64: string, privateKey: CryptoKey) {
	const bytes = fromBase64(dataBase64);
	const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, bytes);
	return await crypto.subtle.importKey('raw', decrypted, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

type IncomingConversationDetailsData = {
	participants: User[],
	messages: IncomingMessageData[],
	conversation_id: number,
	key: string,
}
function isIncomingConversationDetailsData(obj?: Record<string, unknown> | null): obj is IncomingConversationDetailsData {
	return Boolean(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => isUser(p)) &&
		obj.messages instanceof Array &&
		obj.messages.every(isIncomingMessageData) &&
		typeof obj.key === 'string'
	);
}

class IncomingConversationDetails {
	public constructor(private data: IncomingConversationDetailsData, private privateKey: CryptoKey) { }

	public async toProps(): Promise<ChatProps> {
		const key = await getConversationKeyFromBase64(this.data.key, this.privateKey);
		const messages: MessageProps[] = [];
		for (const m of this.data.messages)
			messages.push(await new IncomingMessage(m, key).toProps());

		return {
			conversation_id: this.data.conversation_id,
			messages,
			participants: this.data.participants,
			encryptionKey: key,
		};
	}
}
export async function createNewConversation(participants: User[], privateKey: CryptoKey): Promise<ChatProps | ErrorResult> {
	// Get public keys for participants
	const publicKeysResponse = await fetch('get-keys/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': cookies.get('csrftoken'),
		},
		body: JSON.stringify(participants.map((p) => p.id)),
	});
	if (!publicKeysResponse.ok)
		return { error: 'Error while creating conversaiton' };
	const publicKeys = await publicKeysResponse.json();
	if (!isPublicKeyInfoArray(publicKeys))
		return { error: 'Error while creating conversaiton' };

	// Encrypt a key for this conversation, using public keys
	const conversationKey = await generateConversationKey();
	const keyEncrypted = new FormData();
	for (const keyInfo of publicKeys) {
		keyEncrypted.append(
			keyInfo.user_id.toString(),
			new Blob([await encryptKey(await getPublicKeyFromBase64(keyInfo.public_key_b64), conversationKey)])
		);
	}

	// Upload
	const response = await fetch('start/', {
		method: 'POST',
		headers: { "X-CSRFToken": cookies.get("csrftoken") },
		body: keyEncrypted,
	});
	const data = await response.json();
	if (isIncomingConversationDetailsData(data))
		return await new IncomingConversationDetails(data, privateKey).toProps();
	else
		return { error: 'Error while creating conversaiton' };
}
export async function getConversation(id: number, privateKey: CryptoKey): Promise<ChatProps | ErrorResult> {
	const response = await fetch(`/messages/${id}`);

	if (!response.ok)
		return { error: 'Bad conversation request' };

	const data = await response.json();
	if (isIncomingConversationDetailsData(data))
		return new IncomingConversationDetails(data, privateKey).toProps();
	else
		return { error: 'Bad conversation request' };
}


type IncomingConversationOverviewData = {
	participants: User[],
	last_message: IncomingMessageData,
	id: number,
	key: string,
}
function isIncomingConversationOverviewData(obj: Anything): obj is IncomingConversationOverviewData {
	return !!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => isUser(p)) &&
		typeof obj.last_message === 'object' && obj.last_message &&
		// Every object matches type Anything, but TypeScript complains if we do not explicitly cast it.
		// "Index signature missing": sure, but that just means indexing would return undefined, which fits unknown.
		isIncomingMessageData(obj.last_message as Anything) &&
		typeof obj.id === 'number' &&
		typeof obj.key === 'string'
	);
}
class IncomingConversationOverview {
	public constructor(private data: IncomingConversationOverviewData, private privateKey: CryptoKey) { }

	public async toProps(): Promise<ConversationProps> {
		const key =  await getConversationKeyFromBase64(this.data.key, this.privateKey);
		const last_message = new IncomingMessage(this.data.last_message, key).toProps();
		return {
			id: this.data.id,
			participants: this.data.participants,
			last_message: await last_message,
		};
	}
}

type IncomingConversationListData = {
	conversations: IncomingConversationOverviewData[],
	available_users: User[],
}
function isIncomingConversationListData(obj: Anything): obj is IncomingConversationListData {
	return Boolean(
		obj &&
		obj.conversations instanceof Array &&
		obj.conversations.every(isIncomingConversationOverviewData) &&
		obj.available_users instanceof Array &&
		obj.available_users.every((u) => isUser(u))
	);
}
class IncomingConversationList {
	public constructor(private data: IncomingConversationListData, private privateKey: CryptoKey) { }

	public async toProps(): Promise<ConversationListProps> {
		const conversations: ConversationProps[] = [];
		for (const c of this.data.conversations)
			conversations.push(await new IncomingConversationOverview(c, this.privateKey).toProps());

		return {
			available_users: this.data.available_users,
			conversations,
		};
	}
}
export function parseJsonAsIncomingConversationList(json: string, privateKey: CryptoKey): IncomingConversationList | null {
	const parsed = JSON.parse(json);
	if (isIncomingConversationListData(parsed))
		return new IncomingConversationList(parsed, privateKey)
	else
		return null;
}

type PublicKeyInfo = {
	public_key_b64: string,
	user_id: number,
}
function isPublicKeyInfo(obj: Anything): obj is PublicKeyInfo {
	return Boolean(
		obj &&
		typeof obj.public_key_b64 === 'string' &&
		typeof obj.user_id === 'number'
	);
}
function isPublicKeyInfoArray(obj?: unknown): obj is PublicKeyInfo[] {
	return !!(
		obj &&
		obj instanceof Array &&
		obj.every(isPublicKeyInfo)
	);
}
