import 'vite/modulepreload-polyfill';

import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import Register from '../components/Register.tsx';


const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			<Register />
		</React.StrictMode>
	)
}