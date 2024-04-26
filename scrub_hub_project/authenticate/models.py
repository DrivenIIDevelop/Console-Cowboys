from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(
			self,
			email,
			password,
			**extra_fields
	):
		if not email:
			raise ValueError(_("Need an email"))
		email = self.normalize_email(email)
		user = self.model(
			email=email,
			**extra_fields
		)
		user.set_password(password)
		user.save()
		return user
	def create_superuser(
			self,
			email,
			password,
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
			**extra_fields
		)


class CustomUser(AbstractUser):
	username = None
	email = models.EmailField(_("email address"), unique=True)
	# date_of_birth = models.DateField(
	# 	verbose_name="Birthday"
	# 	null=True
	# )
	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = [
		"first_name",
		"last_name",
	]
	objects = CustomUserManager()
	def __str__(self):
		return self.email
