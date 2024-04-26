import React, { useState, useEffect } from "react";

interface Patient {
	id: number;
	name: string;
	risk_level: string;
	coverage_status: string;
	// Add other properties as needed
}

const PatientList: React.FC = () => {
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

	return (
		<div>
			{/* Header, Date, and Add Patient Button */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div>
					<h2>Patient Catalog</h2>
					<p>{formattedDate}</p>
				</div>

				<button>Add Patient</button>
			</div>

			{/* Search Bar */}
			<input
				type="text"
				placeholder="Search"
				value={searchQuery}
				onChange={handleSearchChange}
			></input>
			{/* List of Patients*/}
			<h3>Previous Patients</h3>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Critical Level</th>
						<th>Patient ID</th>
						<th>Coverage Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredPatients.map((patient) => (
						<tr key={patient.id}>
							<td>{patient.name}</td>
							<td>{patient.risk_level}</td>
							<td>{patient.id}</td>
							<td>{patient.coverage_status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PatientList;
