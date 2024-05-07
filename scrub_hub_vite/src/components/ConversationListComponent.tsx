import { useState } from 'react';
import { User, isChatProps } from './ChatTypes';
import ChatComponent, { ChatProps } from './ChatComponent';
import styles from './chat.module.css';

import { CiSearch } from "react-icons/ci"

export type ConversationProps = {
	participants: User[],
	last_message_time?: Date,
	last_message?: string,
	id: number,
}
function ConversationComponent({ participants, last_message_time, last_message }: ConversationProps) {
	return <div className='relative border-2 border-black p-3'>
		<p className='absolute right-1 top-0 text-sm text-gray-900'>{last_message_time?.toLocaleTimeString()}</p> {/* TODO: Format as "2min ago" */}
		<div className='flex flex-row'>
			<div className='profilePicture' /> {/* Profile picture placeholder. TODO: Include indicator for people who are online */}
			<div className='self-center'>
				<p className='font-bold text-lg'>{participants.map((p) => p.name).join(', ')}</p>
				<p>{last_message ?? 'Click to start a conversaiton'}</p>
			</div>
		</div>
	</div>
}

export type ConversationListProps = {
	conversations: ConversationProps[],
	available_users: User[],
}
export default function ConversationListComponent({ conversations, available_users }: ConversationListProps) {
	const [activeConversation, setConversation] = useState<ChatProps | undefined>();
	const [nextTemporaryId, setTempId] = useState(-1);

	async function conversationClick(url_path: string) {
		const spinner = document.getElementById('messagesSpinner');
		if (spinner) spinner.hidden = false;
		const response = await fetch(`/messages/${url_path}`);
		if (spinner) spinner.hidden = true;

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

	async function openConversation(conversaiton: ConversationProps) {
		let chat: ChatProps;
		if (conversaiton.id < 0) {
			chat = {
				conversation_id: conversaiton.id,
				messages: [],
				participants: conversaiton.participants,
			}
		} else
			chat = await conversationClick(conversaiton.id.toString());
		console.log(chat.conversation_id);
		setConversation(chat);
	}

	async function startConversation(user: User) {
		// dummy conversation; it won't be created for real until first message is sent
		const newConversation: ConversationProps = {
			id: nextTemporaryId,
			participants: [user],
		}
		setTempId(nextTemporaryId - 1);
		openConversation(newConversation);
		// Update list of conversations
		available_users.splice(available_users.findIndex((u) => u.id == user.id), 1);
		conversations.push(newConversation);
	}

	function handleCreated(old_id: number, new_id: number) {
		for (const c of conversations) {
			if (c.id === old_id) {
				c.id = new_id;
				break;
			}
		}
	}

	return <div className={styles.root}>
		<div className={`flex-shrink-0 flex-grow-0 flex flex-col gap-y-3 m-6 items-center overflow-y-scroll`}>
			<p className='text-2xl font-bold'>Recent Chats</p>
			<div className='textInput relative'>
				<input placeholder='search'></input>
				<button type="submit" className='relative top-[0.11rem] self-center m-1'>
					<CiSearch />
				</button>
			</div>
			{conversations.map((c, i) => <div key={i} onClick={() => openConversation(c)}>
				<ConversationComponent {...c} />
			</div>)}
			<p className='text-2xl font-bold'>Start a conversation</p>
			{available_users.map((u, i) => <div key={i} onClick={() => startConversation(u)}>
				<ConversationComponent participants={[u]} id={u.id} />
			</div>)}
		</div>
		<div className='flex-grow relative'>
			<div id='messagesSpinner' hidden className='spinner w-16 h-16'></div>
			{activeConversation ? <ChatComponent {...activeConversation} createdHandler={handleCreated} /> : <></>}
		</div>
	</div>
}
