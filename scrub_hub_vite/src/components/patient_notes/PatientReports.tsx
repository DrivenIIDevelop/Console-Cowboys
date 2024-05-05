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

const PatientReports: React.FC<Props> = ({ patientId}) => {
	const [patientReports, setPatientReports] = useState<PatientReport[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [showAddReportButton, setShowAddReportButton] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [hidden, setHidden] = useState(true);

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

	//Function for changing background color of critical level
	function getBackgroundColor(riskLevel: string) {
		switch (riskLevel) {
			case "Low":
				return "#dcfce7";
			case "Medium":
				return "#fef9c3";
			case "High":
				return "#fee2e2";
			default:
				return "white"; 
		}
	}

	//Handler to change View All > Add Report
	const handleViewAllClick = () => {
		setHidden(false);
		setShowAddReportButton(true);
	  };

	//Change Add Report > View All
	const handleCancelClick = () => {
		setHidden(true);
		setShowAddReportButton(false);
	};

	//Return current date
	useEffect(() => {
		const intervalID = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);

		return () => clearInterval(intervalID);
	}, []);

	//Format Date
	const formattedDate = currentDate.toLocaleDateString("en-US", {
		weekday: "long",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	
	return (
		<div className="w-full h-screen p-4">
			{/* Header and View All Button */}
			<h1 className="text-xl font-bold">Patient Profile</h1>
			<p>{formattedDate}</p>
			<div className="flex justify-between items-top pb-2 bg-white rounded-t-lg pt-1 px-3 mt-3">
				<h2 className="text-md font-bold">Patient Reports</h2>
				<div>
      				{showAddReportButton ? (
						<div>
							<button className="bg-gray-300 rounded-md px-4 py-1 mr-1"
							onClick={handleCancelClick}>
								Cancel
							</button>
							<button
							className="bg-[#63c7b2] rounded-md text-white px-4 py-1"
							onClick={() => window.location.href = `${location.protocol}//${location.host}/notes/reports/${patientId}/add/`}>
								+ Add Report
							</button>
						</div>
      				) : (
        				<button
          				className="bg-[#63c7b2] rounded-md text-white px-4 py-1"
          				onClick={handleViewAllClick}>
							View All
						</button>
      				)}
   				 </div>
			</div>

			{/* List of Reports*/}
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="table-container overflow-y-scroll">
					<table className="w-full border-collapse bg-white">
						<thead>
							<tr>
								<th className="p-2 text-left text-sm">Diagnosis</th>
								<th className="p-2 text-left text-sm">Critical Level</th>
								<th className="p-2 text-left text-sm">Date of Visit</th>
								<th className="p-2 text-left text-sm">Seen By</th>
								<th className="p-2 text-left text-sm">Notes</th>
								<th hidden={hidden} className="p-2 text-left text-sm">Medications Prescribed</th>
							</tr>
						</thead>
						<tbody>
							{patientReports.map((report, index) => (
								<tr key={report.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
									<td className="p-2 text-left">{report.medical_condition}</td>
									<td className="p-2 text-left">
										<span className="rounded-lg px-4 py-.5"
										style={{
											backgroundColor: getBackgroundColor(report.risk_level)}}>
											{report.risk_level}
										</span>
									</td>
									<td className="p-2 text-left">{report.date_recorded}</td>
									<td className="p-2 text-left">{report.physician.name}</td>
									<td className="p-2 text-left">{report.content}</td>
									<td hidden={hidden} className="p-2 text-left">{report.medications_prescribed}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default PatientReports;
