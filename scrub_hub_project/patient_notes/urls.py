# patient_notes/urls.py

from django.urls import path
from . import views

urlpatterns = [
	path('reports/<int:patient_id>/', views.patient_report_list, name='patient_report_list'),
	path('reports/<int:patient_id>/add/', views.add_patient_report, name='add_patient_report'),
	path('reports/details/<int:report_id>/', views.view_patient_report, name='view_patient_report'),
	path('patients/add/', views.create_patient, name='create_patient'),
	path('patients/', views.patient_list, name='patient_list'),
]