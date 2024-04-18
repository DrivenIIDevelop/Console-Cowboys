import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import GetScriptData from '../GetScriptData.ts';
import { ChatComponent, ChatProps } from '../Components/ChatComponent.tsx';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			<ChatComponent {...GetScriptData() as ChatProps} />
		</React.StrictMode>
	)
}
