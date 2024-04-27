from django.db import models

# Create your models here.

class Physician(models.Model):
    name = models.CharField(max_length=100)
    
    # Add any additional fields for physician profile (e.g., specialty)
    def __str__(self):
        return self.name

class Patient(models.Model):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'

    COVERAGE_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive')
    ]

    RISK_CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High')
    ]
    name = models.CharField(max_length=100)
    age = models.IntegerField(blank=True, null=True)
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, default=RISK_CHOICES[0][0])
    coverage_status = models.CharField(max_length=10, choices=COVERAGE_CHOICES, default = COVERAGE_CHOICES[0][0])
    
    def __str__(self):
    	return self.name

class PatientReport(models.Model):
    physician = models.ForeignKey(Physician, on_delete=models.DO_NOTHING) #Not sure if this is correct on_delete
    patient = models.ForeignKey(Patient, on_delete=models.DO_NOTHING)
    medical_condition = models.CharField(max_length=100)
    content = models.TextField()
    date_recorded = models.DateTimeField(auto_now_add=True) # Need to format time
    
    # Add additional fields for file uploads (e.g., FileField for documents)
    def __str__(self):
        return f"Report for {self.patient.name} on {self.date_recorded}"

    class Meta:
        ordering = ['-date_recorded']  # Display reports in descending order of date
