import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { GetScriptDataAsString } from '../GetScriptData.ts';
import ConversationListComponent from '../components/ConversationListComponent.tsx';
import PageWrapper from '../components/PageWrapper.tsx';
import { parseJsonAsIncomingConversationList } from '../models/chat.ts';
import { EnsureLoggedIn, GetUserInfo } from '../loginInfo.ts';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const userInfo = EnsureLoggedIn(GetUserInfo());

	const conversationList = parseJsonAsIncomingConversationList(GetScriptDataAsString(), await userInfo.privateKey);
	if (!conversationList)
		throw 'Invalid data';
	const props = await conversationList.toProps();

	const root = container.reactRoot = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			<PageWrapper>
				<ConversationListComponent {...props} />
			</PageWrapper>
		</React.StrictMode>
	)
}
