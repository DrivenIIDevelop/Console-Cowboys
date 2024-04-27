from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(
			self,
			email,
			password,
			first_name,
			last_name,
			phone_number,
			registration_code,
			employee_id,
			**extra_fields
	):
		if not email:
			raise ValueError(_("Need an email"))
		email = self.normalize_email(email)
		if not first_name:
			raise ValueError(_("Need a First Name"))
		if not last_name:
			raise ValueError(_("Need a Last Name"))
		if not phone_number:
			raise ValueError(_("Need a Phone Number"))
		if not registration_code:
			raise ValueError(_("Need a Registration Code"))
		if not employee_id:
			raise ValueError(_("Need an Employee ID"))
		user = self.model(
			email=email,
			first_name=first_name,
			last_name=last_name,
			phone_number=phone_number,
			registration_code=registration_code,
			employee_id=employee_id,
			**extra_fields
		)
		user.set_password(password)
		user.save()
		return user
	
	def create_superuser(
			self,
			email,
			password,
			first_name,
			last_name,
			**extra_fields
	):
		extra_fields.setdefault("is_staff", True)
		extra_fields.setdefault("is_superuser", True)
		extra_fields.setdefault("is_active", True)
		if extra_fields.get("is_staff") is not True:
			raise ValueError(_("Superuser must have is_staff = True"))
		if extra_fields.get("is_superuser") is not True:
			raise ValueError(_("Superuser must have is_superuser = True"))
		
		return self.create_user(
			email,
			password,
			first_name,
			last_name,
			phone_number="",
			registration_code="",
			employee_id="",
			**extra_fields
		)


class CustomUser(AbstractUser):
	username = None
	email = models.EmailField(_("email address"), unique=True)
	first_name= models.CharField(_("first name"), max_length=150)
	last_name = models.CharField(_("last name"), max_length=150)
	phone_number = models.CharField(_("phone number"), max_length=15)
	registration_code = models.CharField(_("registration code"), max_length=15)
	employee_id = models.CharField(_("employee ID"), max_length=15)
	
	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = [
		"first_name",
		"last_name",
		"phone_number",
		"registration_code",
		"employee_id",
	]
	objects = CustomUserManager()
	def __str__(self):
		return self.email
