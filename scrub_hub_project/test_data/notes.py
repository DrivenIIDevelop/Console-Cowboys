# The functions defined in this file should be run through the Django shell. (See setup.py)

from patient_notes.models import Physician, Patient, PatientReport
from datetime import datetime

def create_physicians():
	physicians_data = [
		{'name': 'Dr. John Doe'},
		{'name': 'Dr. Jane Smith'},
	]
	for data in physicians_data:
		Physician.objects.create(**data)
	print("Physicians created successfully!")

def create_patients():
	patients_data = [
		{'name': 'Johnson, Sam', 'age': 35, 'risk_level': 'Medium', 'coverage_status': 'Active'},
		{'name': 'Brown, Rebecca', 'age': 40, 'risk_level': 'High', 'coverage_status': 'Active'},
	]
	for data in patients_data:
		Patient.objects.create(**data)
	print("Physicians created successfully!")

def create_patient_reports():
	physician1 = Physician.objects.get(name='Dr. John Doe')
	physician2 = Physician.objects.get(name='Dr. Jane Smith')

	patient1 = Patient.objects.get(name='Johnson, Sam')
	patient2 = Patient.objects.get(name='Brown, Rebecca')

	now = datetime.now
	reports_data = [
		{'physician': physician1, 'patient': patient1, 'medical_condition': 'Fever', 'content': 'Patient has a fever.', 'risk_level': 'Medium', 'date_recorded': now},
		{'physician': physician2, 'patient': patient2, 'medical_condition': 'Heart Disease', 'content': 'Patient has heart disease.', 'risk_level': 'High', 'date_recorded': now},
		# Add more test data as needed
	]
	for data in reports_data:
		PatientReport.objects.create(**data)
	print("Physicians created successfully!")

def setup():
	create_physicians()
	create_patients()
	create_patient_reports()

def cleanup():
    # Remove test data for PatientReports
    PatientReport.objects.filter(patient__name='Johnson, Sam').delete()
    PatientReport.objects.filter(patient__name='Brown, Rebecca').delete()

    # Remove test data for Patients
    Patient.objects.filter(name='Johnson, Sam').delete()
    Patient.objects.filter(name='Brown, Rebecca').delete()

    # Remove test data for Physicians
    Physician.objects.filter(name='Dr. John Doe').delete()
    Physician.objects.filter(name='Dr. Jane Smith').delete()
