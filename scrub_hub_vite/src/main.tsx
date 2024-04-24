import 'vite/modulepreload-polyfill';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App, AppProps } from './App.tsx'
import './index.css'
import GetScriptData from './GetScriptData.ts';

// Vite's HMR apparently doesn't work super well with django-vite.
// We check if the root has already been created. If so, we don't need to re-create or re-render here.
// Oddly, serving directly through vite's dev server does not have this issue.
const container: HTMLElement & { reactRoot?: ReactDOM.Root } = document.getElementById('root')!;
if (!container.reactRoot) {
	const root = container.reactRoot = ReactDOM.createRoot(container);
	root.render(
		<React.StrictMode>
			{/*
				Here we are using the results of GetDjangoData as a AppProps object.
				There is nothing in this code or elsewhere that ensures it is actually a AppProps object!
				Unfortunately, I haven't found anything that verifies the type automatically.
				You should probably implement code to validate important props.
			*/}
			<App {...GetScriptData() as AppProps} />
		</React.StrictMode>
	)
}
