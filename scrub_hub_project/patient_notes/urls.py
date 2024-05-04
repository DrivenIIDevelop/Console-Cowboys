# patient_notes/urls.py

from django.urls import path
from . import views

urlpatterns = [
	path('api/reports/<int:patient_id>/add/', views.add_report_api, name='add_report_api'),
	path('api/patients/', views.patient_list_api, name='patient_list_api'),
	path('reports/<int:patient_id>/', views.patient_reports_api, name='patient_reports_api'),
	path('patients/', views.patient_list, name='patient_list'),
	path('patient-profile/<int:patient_id>/', views.patient_profile, name='patient_profile'),
	path('reports/<int:patient_id>/add/', views.add_report, name='add_report'),
]