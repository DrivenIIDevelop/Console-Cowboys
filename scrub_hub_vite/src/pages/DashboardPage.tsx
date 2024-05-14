import 'vite/modulepreload-polyfill';

import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import Dashboard from '../components/Dashboard.tsx';
import PageWrapper from '../components/PageWrapper.tsx';

const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);

	root.render(
		<React.StrictMode>
			<PageWrapper>
				<Dashboard />
			</PageWrapper>
		</React.StrictMode>
	)
}
