from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	phone_number = models.CharField(max_length=15, blank=True)
	employee_id = models.CharField(max_length=20, blank=True)
	registration_code = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return self.user.username
