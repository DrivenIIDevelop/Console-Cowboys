import "vite/modulepreload-polyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import PatientReportsShort from "../components/patient_notes/PatientReportsShort";
import GetScriptData from "../GetScriptData";

const container: HTMLElement & { reactRoot?: ReactDOM.Root } =
	document.getElementById("root")!;
if (!container.reactRoot) {
	const root = (container.reactRoot = ReactDOM.createRoot(container));
	const props = GetScriptData();

	// TODO: Create props file

	root.render(
		<React.StrictMode>
			<PatientReportsShort {...(props as { patientId: number })} />
		</React.StrictMode>
	);
}
