import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import GetScriptData from '../GetScriptData.ts';
import ConversationListComponent from '../components/ConversationListComponent.tsx';
import PageWrapper from '../components/PageWrapper.tsx';
import { IncomingConversationList, isIncomingConversationListData } from '../models/chat.ts';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	const data = GetScriptData();
	if (!isIncomingConversationListData(data))
		throw 'Invalid data';
	const props = new IncomingConversationList(data).toProps();

	root.render(
		<React.StrictMode>
			<PageWrapper>
				<ConversationListComponent {...props} />
			</PageWrapper>
		</React.StrictMode>
	)
}
