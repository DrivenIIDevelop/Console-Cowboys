import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export type ChatProps = {
	participants: string[],
};
export function ChatComponent({ participants }: ChatProps) {
	const [messages, ] = useState<string[]>([]);
	const { readyState } = useWebSocket(`ws://${window.location.host}/ws/`,
		{
			onOpen: () => console.log('open'),
			onClose: () => console.log('close'),
			onMessage: (event) => {
				const data = JSON.parse(event.data);
				if (data.message && typeof data.message === 'string') {
					messages.push(data.message);
					console.log(data.message);
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

	return <>
		<h2>{participants.join(', ')}</h2>
		<p>Status: {connectionStatus}</p>
		{messages.map((m, i) => <div key={i}>{m}</div>)}
	</>
}

export default ChatComponent;
