import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import GetScriptData from '../GetScriptData.ts';
import ConversationListComponent from '../components/ConversationListComponent.tsx';
import { isConversationListProps } from '../components/ChatTypes.ts';
import PageWrapper from '../components/PageWrapper.tsx';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	const props = GetScriptData();
	if (!isConversationListProps(props))
		throw 'Invalid props';

	root.render(
		<React.StrictMode>
			<PageWrapper>
				<ConversationListComponent {...props} />
			</PageWrapper>
		</React.StrictMode>
	)
}
