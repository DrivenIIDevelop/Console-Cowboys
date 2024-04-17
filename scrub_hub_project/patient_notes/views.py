from django.shortcuts import render, redirect, get_object_or_404
from .models import PatientReport, Patient
from .forms import PatientReportForm, NewPatientForm

# Create your views here.

def create_patient(request):
	if request.method == 'POST':
		form = NewPatientForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('patient_list')
	else:
		form = NewPatientForm()

	return render(request, 'patient_notes/new_patient.html', {'form': form})	

def patient_list(request):
	patients = Patient.objects.all()
	return render(request, 'patient_notes/patient_list.html', {'patients': patients})

def patient_report_list(request, patient_id):
	patient = get_object_or_404(Patient, pk=patient_id)
	reports = PatientReport.objects.filter(patient=patient)
	
	return render(request, 'patient_notes/report_list.html', {
		'reports': reports,
		'patient': patient.id,
	})

def add_patient_report(request, patient_id):
	patient = get_object_or_404(Patient, pk=patient_id)
	form = PatientReportForm(request.POST)
	if request.method == 'POST':
			if form.is_valid():
				# set physician ID
				
				# sets patient ID somehow
				report = form.save(commit=False)
				report.patient = patient
				# TODO: Something like report.physician = request.authenticated_user.id
				report.physician_id = 1 # temporary, make up a user ID
				report.save()
				return redirect('patient_report_list', patient_id=patient.id)
			else:
				form = PatientReportForm()
		
	return render(request, 'patient_notes/add_report.html', {
		'form': form,
		'patient': patient.id,
	})

def view_patient_report(request, report_id):
	report = get_object_or_404(PatientReport, pk=report_id)

	return render(request, 'patient_notes/view_report.html', {'report': report})