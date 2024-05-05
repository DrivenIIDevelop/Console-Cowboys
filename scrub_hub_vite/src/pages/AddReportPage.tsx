import "vite/modulepreload-polyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import PatientReports from "../components/patient_notes/PatientReports";
import GetScriptData from "../GetScriptData";
import PageWrapper from "../components/PageWrapper";
import AddReport from "../components/patient_notes/AddReport";

const container: HTMLElement & { reactRoot?: ReactDOM.Root } =
	document.getElementById("root")!;
if (!container.reactRoot) {
	const root = (container.reactRoot = ReactDOM.createRoot(container));
	const props = GetScriptData();

	// TODO: Create props file

	root.render(
		<React.StrictMode>
			<div className="bg-gray-200 w-full h-screen">
				<PageWrapper>
					<AddReport {...props as {patientId: number}}/>
				</PageWrapper>
			</div>
		</React.StrictMode>
	);
}
