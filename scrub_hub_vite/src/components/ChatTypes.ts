/**
 * This file contains type guard functions for component props types.
 * They are in a separate file because eslint says "Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components."
 *
 * These functions will transform the given object in the case that a property that should be a date is actually a string.
 */

import { MessageProps, ChatProps } from './ChatComponent';
import { ConversationProps, ConversationListProps } from './ConversationListComponent';

export function isMessageProps(obj?: {[key: string]: unknown}): obj is MessageProps {
	if (!(
		obj &&
		typeof obj.message === 'string' &&
		typeof obj.username === 'string' &&
		(typeof obj.unconfirmed === 'undefined' || typeof obj.unconfirmed === 'boolean')
	))
		return false;

	if (typeof obj.time === 'string')
		obj.time = new Date(obj.time as string);

	if (obj.time instanceof Date)
		return !isNaN(obj.time.valueOf());
	else
		return false;
}

export function isChatProps(obj?: {[key: string]: unknown}): obj is ChatProps {
	return !!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => typeof p === 'string') &&
		obj.messages instanceof Array &&
		obj.messages.every(isMessageProps)
	);
}

function isConversationProps(obj?: {[key: string]: unknown}): obj is ConversationProps {
	if (!(
		obj &&
		obj.participants instanceof Array &&
		obj.participants.every((p) => typeof p === 'string') &&
		typeof obj.id === 'number'
	))
		return false;

	if (typeof obj.last_message_time === 'string')
		obj.last_message_time = new Date(obj.last_message_time as string);

	if (obj.last_message_time instanceof Date)
		return !isNaN(obj.last_message_time.valueOf());
	else
		return false;
}

export function isConversationListProps(obj?: {[key: string]: unknown}): obj is ConversationListProps {
	return !!(
		obj &&
		obj.conversations instanceof Array &&
		obj.conversations.every(isConversationProps)
	);
}
