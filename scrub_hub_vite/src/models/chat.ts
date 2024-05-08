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

// Message level
export class OutgoingMessage {
	public constructor(private text: string, private id: number) { }

	public getData() {
		return {
			message: this.text,
			id: this.id,
		};
	}
}

type IncomingMessageData = {
	message: string,
	username: string,
	time: string, // must be convertable to Date
}
export function isIncomingMessageData(obj?: {[key: string]: unknown}): obj is IncomingMessageData {
	if (!(
		obj &&
		typeof obj.message === 'string' &&
		typeof obj.username === 'string' &&
		typeof obj.time === 'string'
	))
		return false;

	return !isNaN(new Date(obj.time).valueOf());
}

export class IncomingMessage {

	public constructor(private data: IncomingMessageData) { }

	public toProps(): MessageProps {
		return {
			message: this.data.message,
			username: this.data.username,
			time: new Date(this.data.time),
			unconfirmed: false, // If we have received it, that means it is confirmed.
		};
	}
}

// Conversation level
type IncomingConversationDetailsData = {
	participants: User[],
	messages: IncomingMessageData[],
	conversation_id: number,
}
export function isIncomingConversationDetailsData(obj?: {[key: string]: unknown}): obj is IncomingConversationDetailsData {
	return !!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => isUser(p)) &&
		obj.messages instanceof Array &&
		obj.messages.every(isIncomingMessageData)
	);
}
export class IncomingConversationDetails {
	public constructor(private data: IncomingConversationDetailsData) { }

	public toProps(): ChatProps {
		const messages: MessageProps[] = [];
		for (const m of this.data.messages)
			messages.push(new IncomingMessage(m).toProps());

		return {
			conversation_id: this.data.conversation_id,
			messages,
			participants: this.data.participants,
		};
	}
}

type IncomingConversationOverviewData = {
	participants: User[],
	last_message: IncomingMessageData,
	id: number,
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
		typeof obj.id === 'number'
	);
}
class IncomingConversationOverview {
	public constructor(private data: IncomingConversationOverviewData) { }

	public toProps(): ConversationProps {
		const last_message = new IncomingMessage(this.data.last_message).toProps();
		return {
			id: this.data.id,
			participants: this.data.participants,
			last_message,
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

	public toProps(): ConversationListProps {
		const conversations: ConversationProps[] = [];
		for (const c of this.data.conversations)
			conversations.push(new IncomingConversationOverview(c).toProps());

		return {
			available_users: this.data.available_users,
			conversations,
		};
	}
}
