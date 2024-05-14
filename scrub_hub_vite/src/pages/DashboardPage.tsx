import 'vite/modulepreload-polyfill';

import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import GetScriptData from '../GetScriptData.ts';
import Dashboard from '../components/Dashboard.tsx';
import PageWrapper from '../components/PageWrapper.tsx';



const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	const data = GetScriptData();
	const { first_name, last_name } = data;
	if (typeof data !== 'object' || typeof first_name !== 'string' || typeof last_name !== 'string')
		{
			console.log(data);
			throw 'Invalid data';
		}
	root.render(
		<React.StrictMode>
			<PageWrapper>
				<Dashboard first_name={first_name} last_name={last_name}/>
			</PageWrapper>
		</React.StrictMode>
	)
}
