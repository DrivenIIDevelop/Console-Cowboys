import { ChatProps, MessageProps } from "../components/ChatComponent";
import { ConversationListProps, ConversationProps } from "../components/ConversationListComponent";

export type User = { name: string, id: number };
function isUser(obj?: {[key: string]: unknown}): obj is User {
	return !!(
		obj &&
		typeof obj.name === 'string' &&
		typeof obj.id === 'number'
	);
}

export function toBase64(data: ArrayBuffer) {
	// TypeScript would complain that we aren't passing in a number[]. But, this does work.
	const str = String.fromCharCode.apply(null, new Uint8Array(data) as unknown as number[]);
	return window.btoa(str); // Why this expects a string and not ArrayBuffer, I don't know.
}
function fromBase64(data: string) {
	return Uint8Array.from(atob(data), c => c.charCodeAt(0));
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
export function isIncomingMessageData(obj?: {[key: string]: unknown}): obj is IncomingMessageData {
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

export class IncomingMessage {
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

// Conversation level
async function getConversationKeyFromBase64(dataBase64: string) {
	const bytes = fromBase64(dataBase64);
	return await crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

type IncomingConversationDetailsData = {
	participants: User[],
	messages: IncomingMessageData[],
	conversation_id: number,
	key: string,
}
export function isIncomingConversationDetailsData(obj?: {[key: string]: unknown}): obj is IncomingConversationDetailsData {
	return !!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => isUser(p)) &&
		obj.messages instanceof Array &&
		obj.messages.every(isIncomingMessageData) &&
		typeof obj.key === 'string'
	);
}
export class IncomingConversationDetails {
	public constructor(private data: IncomingConversationDetailsData) { }

	public async toProps(): Promise<ChatProps> {
		const key = await getConversationKeyFromBase64(this.data.key);
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

type IncomingConversationOverviewData = {
	participants: User[],
	last_message: IncomingMessageData,
	id: number,
	key: string,
}
function isIncomingConversationOverviewData(obj?: {[key: string]: unknown}): obj is IncomingConversationOverviewData {
	return !!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => isUser(p)) &&
		typeof obj.last_message === 'object' && obj.last_message &&
		// Every object matches type {[key: string]: unknown}, but TypeScript complains if we do not explicitly cast it.
		// "Index signature missing": sure, but that just means indexing would return undefined, which fits unknown.
		isIncomingMessageData(obj.last_message as {[key: string]: unknown}) &&
		typeof obj.id === 'number' &&
		typeof obj.key === 'string'
	);
}
class IncomingConversationOverview {
	public constructor(private data: IncomingConversationOverviewData) { }

	public async toProps(): Promise<ConversationProps> {
		const key =  await getConversationKeyFromBase64(this.data.key);
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
export function isIncomingConversationListData(obj?: {[key: string]: unknown}): obj is IncomingConversationListData {
	return !!(
		obj &&
		obj.conversations instanceof Array &&
		obj.conversations.every(isIncomingConversationOverviewData) &&
		obj.available_users instanceof Array &&
		obj.available_users.every((u) => isUser(u))
	);
}
export class IncomingConversationList {
	public constructor(private data: IncomingConversationListData) { }

	public async toProps(): Promise<ConversationListProps> {
		const conversations: ConversationProps[] = [];
		for (const c of this.data.conversations)
			conversations.push(await new IncomingConversationOverview(c).toProps());

		return {
			available_users: this.data.available_users,
			conversations,
		};
	}
}
