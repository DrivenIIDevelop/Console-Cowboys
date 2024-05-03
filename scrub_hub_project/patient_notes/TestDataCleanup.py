# cleanup_test_data.py

from patient_notes.models import Physician, Patient, PatientReport

def cleanup_test_data():
    # Remove test data for PatientReports
    PatientReport.objects.filter(patient__name='Johnson, Sam').delete()
    PatientReport.objects.filter(patient__name='Brown, Rebecca').delete()
    # Remove test data for Patients
    Patient.objects.filter(name='Johnson, Sam').delete()
    Patient.objects.filter(name='Brown, Rebecca').delete()
    # Remove test data for Physicians
    Physician.objects.filter(name='Dr. John Doe').delete()
    Physician.objects.filter(name='Dr. Jane Smith').delete()
cleanup_test_data()
