import json
from django.shortcuts import render, redirect, get_object_or_404
from .models import PatientReport, Patient, Physician
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
# Create your views here.

@csrf_exempt
def add_report(request, patient_id):
	if request.method == 'POST':
		# Assuming the POST request contains JSON data
		data = json.loads(request.body)
		
		# Extract data from the request
		physician_id = data.get('physician_id')  # Assuming you send physician_id from React
		medical_condition = data.get('diagnosis')  # Assuming 'diagnosis' corresponds to 'medical_condition' in the model
		content = data.get('notes')  # Assuming 'notes' corresponds to 'content' in the model
		risk_level = data.get('critical_level')  # Assuming 'critical_level' corresponds to 'risk_level' in the model
		medications_prescribed = data.get('medication')  # Assuming 'medication' corresponds to 'medications_prescribed' in the model
		
		# Get Physician object
		print("Physician id: ", physician_id)
		physician = Physician.objects.get(pk=physician_id)
		print(physician)
		# Get Patient object
		patient = Patient.objects.get(pk=patient_id)

		# Create the report object
		report = PatientReport(
			physician=physician,
			patient=patient,
			medical_condition=medical_condition,
			content=content,
			risk_level=risk_level,
			medications_prescribed=medications_prescribed
		)
		report.save()

		# Return a JSON response indicating success
		return JsonResponse({'message': 'Report added successfully'})
	else:
		# Return an error response if the request method is not POST
		return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'}, status=405)

def patient_reports_api(request, patient_id):
	print("test")
	patient = get_object_or_404(Patient, pk=patient_id)
	print("test")

	if patient:
		reports = PatientReport.objects.filter(patient_id=patient_id)

		data = [{'id': report.id, 'physician': {'id': report.physician.id,'name': report.physician.name}, 'medical_condition': report.medical_condition, 'patient': {'id': patient.id, 'name': patient.name}, 'content': report.content, 'date_recorded': report.date_recorded.strftime('%m/%d/%Y'), 'risk_level': report.risk_level, 'medications_prescribed': report.medications_prescribed} for report in reports]

		return JsonResponse({'reports': data})
	else:
		return JsonResponse({'error': 'Patient ID is required'}, status=400)

def patient_list_api(request):
	# TODO: This list needs to be generated based on the physician ID of the logged in User
	patients = Patient.objects.all()
	data = [{'id': patient.id, 'name': patient.name, 'risk_level': patient.risk_level, 'coverage_status': patient.coverage_status} for patient in patients]
	return JsonResponse(data, safe=False)

#@login_required(login_url='authenticate-login') 
#Will remove after testing finished
def patient_list(request):
	return render(request, 'patient_notes/patient_list_page.html')

def patient_profile(request, patient_id):
	objectToPassToReact = {
		'patientId': patient_id,
	}
	# We will pass the object via Django's rendering context
	# This context should be a dictionary.
	# You can use whatever key you want; you'll get data from the context by using the key in the HTML template.
	context = { 'patientId': objectToPassToReact }
	return render(request, 'patient_notes/patient_profile.html', context)
