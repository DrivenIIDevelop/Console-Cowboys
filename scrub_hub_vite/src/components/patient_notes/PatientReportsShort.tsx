//This component is the short list of patient reports found on the patient's profile. The user can click View All button to be take to PatientReportsFull component.

import React, { useState, useEffect } from "react";

interface PatientReport {
	id: number;
	physician: {
		id: number;
		name: string;
	};
	patient: {
		id: number;
		name: string;
	};
	medical_condition: string;
	content: string;
	date_recorded: string;
	risk_level: string;
	medications_prescribed: string;
}

interface Props {
	patientId: number;
}

const PatientReportsShort: React.FC<Props> = ({ patientId }) => {
	const [patientReports, setPatientReports] = useState<PatientReport[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		//Fetch patient data from the backend API
		const fetchReports = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/notes/reports/${patientId}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch patient data");
				}
				const data = await response.json();
				setPatientReports(data.reports);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching patient data:", error);
			}
		};

		fetchReports();
	}, []);

	return (
		<div>
			{/* Header and View All Button */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Patient Reports</h2>
				<button>View All</button>
			</div>

			{/* List of Reports*/}
			{loading ? (
				<p>Loading...</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Diagnosis</th>
							<th>Critical Level</th>
							<th>Date of Visit</th>
							<th>Seen By</th>
							<th>Notes</th>
							<th>Medications Prescribed</th>
						</tr>
					</thead>
					<tbody>
						{patientReports.map((report) => (
							<tr key={report.id}>
								<td>{report.medical_condition}</td>
								<td>{report.risk_level}</td>
								<td>{report.date_recorded}</td>
								<td>{report.physician.name}</td>
								<td>{report.content}</td>
								<td>{report.medications_prescribed}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default PatientReportsShort;
