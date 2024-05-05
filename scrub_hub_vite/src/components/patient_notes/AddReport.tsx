import React, { useState } from "react";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface AddReportProps {
	patientId: number;
}

const AddReport: React.FC<AddReportProps> = ({ patientId }) => {
	const [criticalLevel, setCriticalLevel] = useState("Low");
	const [currentDoctorId, setCurrentDoctorId] = useState("");
	const [medication, setMedication] = useState("N/A");
	const [notes, setNotes] = useState("");
	const [diagnosis, setDiagnosis] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(`http://localhost:8000/notes/api/reports/${patientId}/add/`,
				{
					critical_level: criticalLevel,
					physician_id: currentDoctorId,
					medication: medication,
					notes: notes,
					diagnosis: diagnosis,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": cookies.get("csrftoken"),
					}

				}
			);
			console.log(response.data);
			//Redirect to patient notes if Successful
			window.location.href = `${location.protocol}//${location.host}/notes/patient-profile/${patientId}`
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<div className="w-full h-screen">	
			<form onSubmit={handleSubmit} className="flex flex-col bg-white rounded-lg p-2 m-4 items-start">
				<h3 className="text-md font-bold">Patient Medical Report</h3>
				<h4 className="text-sm font-bold mt-4">Physician Information</h4>
				<div className="flex flex-col">
					<label htmlFor="current-doctor-id" className="text-gray-500 text-sm">Your ID:</label>
					<input
						className="bg-gray-100 border border-gray-400 rounded-sm p-1"
						type="text"
						id="current-doctor-id"
						value={currentDoctorId}
						onChange={(e) => setCurrentDoctorId(e.target.value)}
						required
					/>
				</div>
				<h4 className="text-sm font-bold mt-4">Critical Level</h4>
				<div className="flex flex-col">
					<label htmlFor="critical-level" className="text-gray-500 text-sm">Critical Level:</label>
					<select
						id="critical-level"
						value={criticalLevel}
						onChange={(e) => setCriticalLevel(e.target.value)}
						required
					>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
				</div>
				<h4 className="text-sm font-bold mt-4">Medical Examination</h4>
				<div className="flex flex-col">
					<label htmlFor="diagnosis" className="text-gray-500 text-sm">Diagnosis:</label>
					<textarea
						className="bg-gray-100 border border-gray-400 rounded-sm p-1"
						placeholder="Input diagnosis"
						id="diagnosis"
						value={diagnosis}
						onChange={(e) => setDiagnosis(e.target.value)}
						required
					></textarea>
				</div>
				<div className="flex flex-col">
					<label htmlFor="notes" className="text-gray-500 text-sm">Notes:</label>
					<textarea
						className="bg-gray-100 border border-gray-400 rounded-sm p-1"
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					></textarea>
				</div>
				<div className="flex flex-col">
					<label htmlFor="medication" className="text-gray-500 text-sm">Medication Prescribed:</label>
					<input
						className="bg-gray-100 border border-gray-400 rounded-sm p-1"
						type="text"
						id="medication"
						value={medication}
						onChange={(e) => setMedication(e.target.value)}
					/>
				</div>
				<button type="submit" className="bg-[#63c7b2] rounded-md text-white px-4 py-1 self-end">Save</button>
				{/* Display error if there is an error */}
				{error && <div>{error}</div>}
			</form>
		</div>
	);
};

export default AddReport;
