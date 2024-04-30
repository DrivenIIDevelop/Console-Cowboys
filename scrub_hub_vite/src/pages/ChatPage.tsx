import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import GetScriptData from '../GetScriptData.ts';
import ConversationListComponent from '../components/ConversationListComponent.tsx';
import { isConversationListProps } from '../components/ChatTypes.ts';
import Navigation from '../components/Navigation.tsx';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	const props = GetScriptData();
	if (!isConversationListProps(props))
		throw 'Invalid props';

	root.render(
		<React.StrictMode>
			<div className="flex max-h-screen">
				<Navigation />
				<ConversationListComponent {...props} />
			</div>
		</React.StrictMode>
	)
}
