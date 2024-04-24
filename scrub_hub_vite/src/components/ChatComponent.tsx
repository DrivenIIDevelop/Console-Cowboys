import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
// TODO: Have actually good styles.
import styles from './ChatComponent.module.css'; // VS Code extension "CSS Modules" by clinyong gives autocomplete support for css modules
import { isMessageProps } from './ChatTypes';

export type MessageProps = {
	message: string,
	username: string,
	time: Date,
	unconfirmed?: boolean,
};
function MessageComponent({ message, username, time, unconfirmed } : MessageProps) {
	return <>
		<text className={styles.messageUsername}>{username}</text>
		{ unconfirmed
			? <text>sending...</text>
			: <text className={styles.messageTime}>{time.toLocaleString()}</text>
		}
		<p className={styles.message}>{message}</p>
	</>
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

	function addMessage(message: MessageProps) {
		messagesState.push(message);
	}

	const { readyState, sendJsonMessage } = useWebSocket(`ws://${window.location.host}/ws/${conversation_id}`,
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

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState];

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
	return <div className={styles.root}>
		<h2>Participants: {participants.join(', ')}</h2>
		<p>Status: {connectionStatus}</p>
		{messagesState.map((m, i) => <MessageComponent key={i} {...m} />)}
		<input id='messagebox' type='text' placeholder='message' value={userMessage}
			onChange={(e) => setMessageInput(e.target.value)}
			onKeyUp={(e) => { if (e.key === 'Enter') send() }}
		/>
		<button type='button' onClick={send}>SEND</button>
	</div>
}

export default ChatComponent;
