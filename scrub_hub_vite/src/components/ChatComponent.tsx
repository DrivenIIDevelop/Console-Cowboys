import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import styles from './chat.module.css'; // VS Code extension "CSS Modules" by clinyong gives autocomplete support for css modules
import { isMessageProps } from './ChatTypes';
import { FaArrowRight } from 'react-icons/fa';

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
	participants: string[],
	messages: MessageProps[],
	conversation_id: number,
};
export function ChatComponent({ participants, messages, conversation_id }: ChatProps) {
	const [messagesState, setMsgs] = useState<MessageProps[]>(messages);
	// Confusingly, the state won't get updated when we update the props. So we need an effect.
	useEffect(() => setMsgs(messages), [messages]);

	function scrollToBottom() {
		const container = document.getElementById('messageContainer');
		if (container) {
			container.scrollTop = container.scrollHeight;
		} else {
			console.log('no foo');
		}
	}
	scrollToBottom();

	function addMessage(message: MessageProps) {
		messagesState.push(message);
		scrollToBottom();
	}

	const { sendJsonMessage } = useWebSocket(`ws://${window.location.host}/ws/${conversation_id}`,
		{
			onOpen: () => console.log('open'),
			onClose: () => console.log('close'),
			onMessage: (event) => {
				const data = JSON.parse(event.data);
				if (isMessageProps(data)) {
					addMessage(data);
				} else if (typeof data.received === 'number') {
					messagesState[data.received].unconfirmed = false;
				} else {
					console.log('invalid data received');
					console.log(data);
				}
			},
			shouldReconnect: () => false,
		}
	);

	const [userMessage, setMessageInput] = useState('');
	const send = () => {
		if (!userMessage)
			return;

		const message: MessageProps & { id: number } = {
			message: userMessage,
			username: 'You',
			time: new Date(),
			unconfirmed: true,
			id: messagesState.length, // Track when it's been received.
		};

		sendJsonMessage(message);
		addMessage(message);
		setMessageInput('');
	};

	// Any tag selectors in the .module.css file would apply to the entire page.
	// We get around this by giving the component a "root" element.
	// Selector "button" changes to ".root button" and now only buttons inside this component are styled.
	return <div className='p-4 flex flex-col h-full'>
		<div className='flex-grow-0 flex'>
			<div className='profilePicture' />
			<p className='flex-grow-0 text-2xl font-bold self-center'>{participants.join(', ')}</p>
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
