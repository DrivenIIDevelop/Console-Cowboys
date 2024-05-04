import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

interface Patient {
	id: number;
	name: string;
	risk_level: string;
	coverage_status: string;
}
interface Props {
	hidden: boolean;
}

const PatientList: React.FC<Props> = (props) => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [searchQuery, setSearchQuery] = useState<string>("");

	//Patient List
	useEffect(() => {
		//Fetch patient data from the backend API
		const fetchPatients = async () => {
			try {
				const response = await fetch(
					"http://localhost:8000/notes/api/patients/"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch patient data");
				}
				const data = await response.json();
				setPatients(data);
			} catch (error) {
				console.error("Error fetching patient data:", error);
			}
		};

		fetchPatients();
	}, []);

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

	//Search
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	//Filter patients based on search
	const filteredPatients = patients.filter((patient) =>
		patient.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

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

	return (
		<div className="bg-gray-200 w-full h-screen p-4">
			{/* Header, Date, and Add Patient Button */}
			<div className="flex justify-between items-center pb-2">
				<div hidden={props.hidden}>
					<h2 className="text-xl font-bold">Patient Catalog</h2>
					<p>{formattedDate}</p>
				</div>
				<div hidden={props.hidden}>
					<button className="bg-[#63c7b2] rounded-md text-white px-4 py-1">
						+ Add Patient
					</button>
				</div>
			</div>

			{/* Search Bar */}
			<div hidden={props.hidden} className="textInput relative">
				<input
					className="bg-white text-gray-600 placeholder-grey-500 w-full pl-8 p-1"
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<span className="absolute inset-y-0 left-0 flex items-center pl-3">
					<CiSearch />
				</span>
			</div>

			{/* List of Patients*/}
			<h3 className="mt-6 pl-2 font-bold text-md bg-white rounded-t-lg">
				Previous Patients
			</h3>
			<div className="table-container overflow-y-scroll">
				<table className="w-full border-collapse bg-white">
					<thead>
						<tr>
							<th className="p-2 text-left"></th>
							<th className="p-2 text-left text-sm">Name</th>
							<th className="p-2 text-left text-sm">Critical Level</th>
							<th className="p-2 text-left text-sm">Patient ID</th>
							<th className="p-2 text-left text-sm">Coverage Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredPatients.map((patient, index) => (
							<tr key={patient.id}
								className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}>
								<td className="p-2">
									<div
										style={{
											width: "50px",
											height: "50px",
											borderRadius: "50%",
											backgroundColor: "#63c7b2",
										}}
									></div>
								</td>
								<td className="p-2 text-left">{patient.name}</td>
								<td className="p-2 text-left">
									<span className="rounded-lg px-4 py-.5"
										style={{
											backgroundColor: getBackgroundColor(patient.risk_level)}}>
										{patient.risk_level}
									</span>
								</td>
								<td className="p-2 text-left">{patient.id}</td>
								<td className="p-2 text-left">{patient.coverage_status}</td>
								<td className="p-2 text-left">
									<a className={index % 2 === 0 ? "bg-white rounded-lg p-2" : "bg-gray-200 rounded-lg p-2"}
										href={`${location.protocol}//${location.host}/notes/patient-profile/${patient.id}`}>
										View Reports
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PatientList;
