import { useState } from 'react';
import { isChatProps } from './ChatTypes';
import ChatComponent, { ChatProps } from './ChatComponent';
import styles from './chat.module.css';

export type ConversationProps = {
	participants: string[],
	last_message_time: Date,
	id: number,
}
function ConversastionComponent({ participants, last_message_time }: ConversationProps) {
	return <div>
		<p>{participants.join(', ')}</p>
		<p>{last_message_time.toLocaleTimeString()}</p>
	</div>
}

export type ConversationListProps = {
	conversations: ConversationProps[],
	available_users: { name: string, id: number }[],
}
export default function ConversationListComponent({ conversations, available_users }: ConversationListProps) {
	const [activeConversation, setConversation] = useState<ChatProps | undefined>();

	async function conversationClick(url_path: string) {
		const response = await fetch(`/messages/${url_path}`);
		if (!response.ok) {
			alert('error');
			throw 'Bad conversation request';
		}
		const data = await response.json();
		if (isChatProps(data)) {
			return data;
		} else {
			alert('error');
			throw 'Bad conversation data';
		}
	}

	async function openConversation(id: number) {
		const chat = await conversationClick(id.toString());
		setConversation(chat);
	}

	async function startConversation(user_id: number) {
		const chat = await conversationClick(`start/${user_id}`);
		setConversation(chat);
		// Update list of conversations
		available_users.splice(available_users.findIndex((u) => u.id == user_id), 1);
		conversations.push({
			id: chat.conversation_id,
			participants: chat.participants,
			last_message_time: new Date(),
		});
	}

	return <div className={styles.root}>
		<div className={styles.conversationList}>
			<h2>Existing conversations</h2>
			{conversations.map((c, i) => <div key={i} onClick={() => openConversation(c.id)}>
				<ConversastionComponent {...c} />
			</div>)}
			<h2>Start a conversation</h2>
			{available_users.map((u, i) => <div key={i} onClick={() => startConversation(u.id)}>{u.name}</div>)}
		</div>
		<div className={styles.chatArea}>
			{activeConversation ? <ChatComponent {...activeConversation} /> : <></>}
		</div>
	</div>
}
