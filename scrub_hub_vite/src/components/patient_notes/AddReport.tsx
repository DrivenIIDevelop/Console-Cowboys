import React, { useState } from "react";
import axios from "axios";

interface AddReportProps {
	patientId: number;
}

const AddReport: React.FC<AddReportProps> = ({ patientId }) => {
	const [criticalLevel, setCriticalLevel] = useState("");
	const [currentDoctorId, setCurrentDoctorId] = useState("");
	const [medication, setMedication] = useState("");
	const [notes, setNotes] = useState("");
	const [diagnosis, setDiagnosis] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(`notes/api/reports/${patientId}/add/`, {
				critical_level: criticalLevel,
				physician_id: currentDoctorId,
				medication: medication,
				notes: notes,
				diagnosis: diagnosis,
			});
			console.log(response.data);
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Patient Medical Report</h3>
			<h4>Physician Information</h4>
			<div>
				<label htmlFor="current-doctor-id">Your ID:</label>
				<input
					type="text"
					id="current-doctor-id"
					value={currentDoctorId}
					onChange={(e) => setCurrentDoctorId(e.target.value)}
				/>
			</div>
			<h4>Critical Level</h4>
			<div>
				<label htmlFor="critical-level">Critical Level:</label>
				<select
					id="critical-level"
					value={criticalLevel}
					onChange={(e) => setCriticalLevel(e.target.value)}
				>
					<option value="Low">Low</option>
					<option value="Medium">Medium</option>
					<option value="High">High</option>
				</select>
			</div>
			<h4>Medical Examination</h4>
			<div>
				<label htmlFor="medication">Medication Prescribed:</label>
				<input
					type="text"
					id="medication"
					value={medication}
					onChange={(e) => setMedication(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="notes">Notes:</label>
				<textarea
					id="notes"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				></textarea>
			</div>
			<div>
				<label htmlFor="diagnosis">Diagnosis:</label>
				<textarea
					id="diagnosis"
					value={diagnosis}
					onChange={(e) => setDiagnosis(e.target.value)}
				></textarea>
			</div>
			<button type="submit">Save</button>
			{error && <div>{error}</div>}
		</form>
	);
};

export default AddReport;
