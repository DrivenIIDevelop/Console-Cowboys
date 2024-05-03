import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import PatientList from "../components/patient_notes/PatientList.tsx";
import PageWrapper from "../components/PageWrapper.tsx";
import schedule from "../assets/schedule.jpg";

const container: HTMLElement & { reactRoot?: ReactDOM.Root } =
	document.getElementById("root")!;
if (!container.reactRoot) {
	const root = (container.reactRoot = ReactDOM.createRoot(container));

	root.render(
		<React.StrictMode>
			<PageWrapper>
				<PatientList />
				{/* This would eventually be it's own component
				but I am writing inline JSX for time-sake */}
				<div className="bg-gray-200 pt-5">
					<div className="bg-[#63c7b2] rounded-tl-lg p-4 h-screen">
						<img
							src={schedule}
							alt="Schedule"
							className="w-full h-auto rounded-md"
						/>
					</div>
				</div>
			</PageWrapper>
		</React.StrictMode>
	);
}
