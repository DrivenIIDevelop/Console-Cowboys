import { useState } from 'react';
import { isChatProps } from './ChatTypes';
import ChatComponent, { ChatProps } from './ChatComponent';

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
}
export default function ConversationListComponent({ conversations }: ConversationListProps) {
	const [activeConversation, setConversation] = useState<ChatProps | undefined>();

	async function conversationClick(conversation_id: number) {
		const response = await fetch(`/messages/${conversation_id}/`);
		if (!response.ok) {
			alert('error');
			throw 'Bad conversation request';
		}
		const data = await response.json();
		if (isChatProps(data)) {
			setConversation(data);
		} else {
			alert('error');
			throw 'Bad conversation data';
		}
	}

	return <>
		{conversations.map((c, i) => <div key={i} onClick={() => conversationClick(c.id)}>
			<ConversastionComponent {...c} />
		</div>)}
		{activeConversation ? <ChatComponent {...activeConversation} /> : <></>}
	</>
}
