import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
// TODO: Have actually good styles.
import styles from './ChatComponent.module.css'; // VS Code extension "CSS Modules" by clinyong gives autocomplete support for css modules

type MessageProps = {
	message: string,
	username: string,
	time: Date,
};
/**
 * Checks if the given object is a MessageProps.
 * If it is a MessageProps except that time is a string (the way it is received from the server), it converts time to a Date.
 * @param obj The object to check and convert.
 */
function isMessageProps(obj: Partial<MessageProps>): obj is MessageProps {
	const canBeMessageProps = !!(
		obj && obj.message && obj.username && obj.time &&
		typeof obj.message === 'string' &&
		typeof obj.username === 'string'
	);
	if (canBeMessageProps && typeof obj.time === 'string')
		obj.time = new Date(obj.time as string);
	return canBeMessageProps;
}
function MessageComponent({ message, username, time} : MessageProps) {
	return <>
		<text className={styles.messageUsername}>{username}</text>
		<text className={styles.messageTime}>{time.toLocaleString()}</text>
		<p className={styles.message}>{message}</p>
	</>
}

export type ChatProps = {
	participants: string[],
};
export function ChatComponent({ participants }: ChatProps) {
	const [messages, ] = useState<MessageProps[]>([]);
	const addMessage = (nessage: MessageProps) => {
		messages.push(nessage);
	}

	const { readyState, sendJsonMessage } = useWebSocket(`ws://${window.location.host}/ws/`,
		{
			onOpen: () => console.log('open'),
			onClose: () => console.log('close'),
			onMessage: (event) => {
				const data = JSON.parse(event.data);
				if (isMessageProps(data)) {
					addMessage(data);
				} else {
					console.log('not a message props');
					console.log(data);
				}
			},
			shouldReconnect: (_) => false,
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

		const message: MessageProps = {
			message: userMessage,
			username: 'You',
			time: new Date(),
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
		{messages.map((m, i) => <MessageComponent key={i} {...m} />)}
		<input id='messagebox' type='text' placeholder='message' value={userMessage}
			onChange={(e) => setMessageInput(e.target.value)}
			onKeyUp={(e) => { if (e.key === 'Enter') send() }}
		/>
		<button type='button' onClick={send}>SEND</button>
	</div>
}

export default ChatComponent;
