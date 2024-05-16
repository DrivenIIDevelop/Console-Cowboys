import { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import styles from './chat.module.css'; // VS Code extension "CSS Modules" by clinyong gives autocomplete support for css modules
import { FaArrowRight } from 'react-icons/fa';
import { IncomingConversationDetails, IncomingMessage, OutgoingMessage, User, isIncomingConversationDetailsData, isIncomingMessageData, isPublicKeyInfoArray } from '../models/chat';
import { encryptKey, generateConversationKey, getPublicKeyFromBase64 } from '../encryption';

import Cookies from 'universal-cookie';
import { LoginContext, LoginState } from '../loginInfo';
const cookies = new Cookies();

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

async function createConversation(participants: User[], privateKey: CryptoKey): Promise<ChatProps> {
	// Get public keys for participants
	const publicKeysResponse = await fetch('get-keys/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': cookies.get('csrftoken'),
		},
		body: JSON.stringify(participants.map((p) => p.id)),
	});
	if (!publicKeysResponse.ok)
		throw 'Error while creating conversaiton';
	const publicKeys = await publicKeysResponse.json();
	if (!isPublicKeyInfoArray(publicKeys))
		throw 'Error while creating conversaiton';

	// Encrypt a key for this conversation, using public keys
	const conversationKey = await generateConversationKey();
	const keyEncrypted = new FormData();
	for (const keyInfo of publicKeys) {
		keyEncrypted.append(
			keyInfo.user_id.toString(),
			new Blob([await encryptKey(await getPublicKeyFromBase64(keyInfo.public_key_b64), conversationKey)])
		);
	}

	// Upload
	const response = await fetch('start/', {
		method: 'POST',
		headers: {
			"X-CSRFToken": cookies.get("csrftoken"),
		},
		body: keyEncrypted,
	});
	const data = await response.json();
	if (isIncomingConversationDetailsData(data))
		return new IncomingConversationDetails(data, privateKey).toProps();
	else
		throw 'Error while creating conversation'; // TODO: Handle
}

export type ChatProps = {
	participants: User[],
	messages: MessageProps[],
	conversation_id: number,
	encryptionKey?: CryptoKey,
	createdHandler?: (old_id: number, new_id: number) => void,
};
export function ChatComponent({ participants, messages, conversation_id, encryptionKey, createdHandler }: ChatProps) {
	const userInfo = useContext(LoginContext);
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
				const data = JSON.parse(event.data);
				if (isIncomingMessageData(data)) {
					addMessage(await new IncomingMessage(data, keyState!).toProps());
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

	if (!userInfo.user || userInfo.loggedIn !== LoginState.IN) {
		// This shouldn't ever happen. Django would redirect us first.
		window.location.href = `${location.protocol}//${location.host}/authenticate/login`;
		throw 'Not logged in';
	}

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
			const chat = await createConversation(participants, await userInfo.user!.privateKey);
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
