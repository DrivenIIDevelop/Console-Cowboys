# patient_notes/forms.py

from django import forms
from .models import PatientReport, Patient

class PatientReportForm(forms.ModelForm):
    class Meta:
        model = PatientReport
        fields = ['medical_condition', 'content'] 

class NewPatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ['name', 'age', 'risk_level']