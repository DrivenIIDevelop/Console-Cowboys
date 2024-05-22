import { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import styles from './chat.module.css'; // VS Code extension "CSS Modules" by clinyong gives autocomplete support for css modules
import { FaArrowRight } from 'react-icons/fa';
import { OutgoingMessage, User, createNewConversation, parseWebSocketMessage } from '../models/chat';

import { EnsureLoggedIn, LoginContext } from '../loginInfo';
import { isError } from '../models/types';

export type MessageProps = {
	message: string,
	username: string,
	time: Date,
	unconfirmed?: boolean,
};
function MessageComponent({ message, username, time, unconfirmed } : MessageProps) {
	return <div className='flex flex-row'>
		<div className='profilePicture' /> {/* Profile picture placeholder. TODO: Include indicator for people who are online */}
		<div className='self-center'>
			<text className={styles.messageUsername}>{username}</text>
			{ unconfirmed
				? <text>sending...</text>
				: <text className='text-gray-500'>{time.toLocaleString()}</text>
			}
			<p>{message}</p>
		</div>
	</div>
}

export type ChatProps = {
	participants: User[],
	messages: MessageProps[],
	conversation_id: number,
	encryptionKey?: CryptoKey,
	createdHandler?: (old_id: number, new_id: number) => void,
};
export function ChatComponent({ participants, messages, conversation_id, encryptionKey, createdHandler }: ChatProps) {
	const userInfo = EnsureLoggedIn(useContext(LoginContext));
	const [messagesState, setMsgs] = useState<MessageProps[]>(messages);
	const [userMessage, setMessageInput] = useState('');
	// eslint-disable-next-line prefer-const
	let [keyState, setKey] = useState(encryptionKey);
	// Confusingly, the state won't get updated when we update the props. So we need an effect.
	useEffect(() => setMsgs(messages), [messages]);

	const { sendJsonMessage } = useWebSocket(`ws://${window.location.host}/ws/${conversation_id}`,
		{
			onOpen: () => console.log('open'),
			onClose: () => console.log('close'),
			onMessage: async (event) => {
				if (keyState === undefined)
					throw 'No key'; // should not be possible

				const data = parseWebSocketMessage(event.data, keyState);
				if (isError(data)) {
					console.log(event.data);
					throw data.error;
				}

				// We might receive info about a new message
				if (data.message)
					addMessage(await data.message.toProps());
				// or we might receive confirmation that a message we sent was received
				else if (data.received !== undefined)
					messagesState[data.received].unconfirmed = false;
			},
			shouldReconnect: () => false,
		}
	);

	function scrollToBottom() {
		const container = document.getElementById('messageContainer');
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}
	scrollToBottom();

	function addMessage(message: MessageProps) {
		messagesState.push(message);
		scrollToBottom();
	}

	const send = async () => {
		if (!userMessage)
			return;

		// On first message, create conversation
		if (conversation_id < 0) {
			const chat = await createNewConversation(participants, await userInfo.privateKey);
			if (isError(chat))
				throw chat.error; // TODO: Handle
			setKey(keyState = chat.encryptionKey);
			createdHandler?.(conversation_id, chat.conversation_id);
			sendJsonMessage({
				'created': chat.conversation_id,
			});
		}
		if (keyState === undefined)
			throw 'No key'; // should not be possible

		const message: MessageProps & { id: number } = {
			message: userMessage,
			username: 'You',
			time: new Date(),
			unconfirmed: true,
			id: messagesState.length, // Track when it's been received.
		};
		const outgoingMessage = new OutgoingMessage(message.message, message.id, keyState);
		sendJsonMessage(await outgoingMessage.getData());

		addMessage(message);
		setMessageInput('');
	};

	// Any tag selectors in the .module.css file would apply to the entire page.
	// We get around this by giving the component a "root" element.
	// Selector "button" changes to ".root button" and now only buttons inside this component are styled.
	return <div className='p-4 flex flex-col h-full'>
		<div className='flex-grow-0 flex'>
			<div className='profilePicture' />
			<p className='flex-grow-0 text-2xl font-bold self-center'>{participants.map((p) => p.name).join(', ')}</p>
		</div>
		<div id='messageContainer' className='flex-grow-1 overflow-y-scroll h-full'>
			{messagesState.map((m, i) => <MessageComponent key={i} {...m} />)}
		</div>
		<div className='flex-grow-0 textInput flex mt-6'>
			<input type='text' className='flex-grow' placeholder='message' value={userMessage}
				onChange={(e) => setMessageInput(e.target.value)}
				onKeyUp={(e) => { if (e.key === 'Enter') send() }}
			/>
			<button type='button' className='flex-grow-0' onClick={send}><FaArrowRight /></button>
		</div>
	</div>
}

export default ChatComponent;
