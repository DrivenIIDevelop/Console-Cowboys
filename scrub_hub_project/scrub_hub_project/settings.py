"""
Django settings for scrub_hub_project project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-xdyz6-npg4j@!0o$9n(73j1a1gqc#wkjfbcuu4d3r#b8o59=tw"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '0.0.0.0']


# Application definition

INSTALLED_APPS = [
	"daphne", # Django's development server doesn't support ASGI. Daphne adds that support.
	"django.contrib.admin",
	"django.contrib.auth",
	"django.contrib.contenttypes",
	"django.contrib.sessions",
	"django.contrib.messages",
	"django.contrib.staticfiles",
	"django_vite",
	"scrub_hub_frontend",
	"patient_notes",
	"corsheaders",
	"anymail",
	"channels", # Async support (used for websockets in chat)
	"scrub_hub_chat",
]

DJANGO_VITE = {
	"default": {
		"dev_mode": DEBUG,
		"manifest_path": BASE_DIR / 'vite_dist/manifest.json', # This won't be used in dev mode.
	}
}

MIDDLEWARE = [
	"django.middleware.security.SecurityMiddleware",
	"django.contrib.sessions.middleware.SessionMiddleware",
	"django.middleware.common.CommonMiddleware",
	"django.middleware.csrf.CsrfViewMiddleware",
	"django.contrib.auth.middleware.AuthenticationMiddleware",
	"django.contrib.messages.middleware.MessageMiddleware",
	"django.middleware.clickjacking.XFrameOptionsMiddleware",
	"corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "scrub_hub_project.urls"

TEMPLATES = [
	{
		"BACKEND": "django.template.backends.django.DjangoTemplates",
		"DIRS": [],
		"APP_DIRS": True,
		"OPTIONS": {
			"context_processors": [
				"django.template.context_processors.debug",
				"django.template.context_processors.request",
				"django.contrib.auth.context_processors.auth",
				"django.contrib.messages.context_processors.messages",
			],
		},
	},
]

WSGI_APPLICATION = "scrub_hub_project.wsgi.application"
# Asyncronous support, for chat
ASGI_APPLICATION = "scrub_hub_project.asgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.sqlite3",
		"NAME": BASE_DIR / "db.sqlite3",
	}
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
	},
	{"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
	{"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
	{"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
if DEBUG:
	STATICFILES_DIRS = [
		BASE_DIR / "../scrub_hub_vite/public",
		BASE_DIR / "../scrub_hub_vite",
	]
else:
	STATICFILES_DIRS = [
		BASE_DIR / "vite_dist",
	]
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Start of Email Functionality

CORS_ORIGIN_ALLOW_ALL = True # Use this for development only

# in production replace with
# CORS_ALLOWED_ORIGINS = [
# "http://localhost:3000", # React app
# "http://yourdomain.com", # Your production domain
# ]

EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
DEFAULT_FROM_EMAIL = "consolecowboytest@gmail.com"
SERVER_EMAIL = "consolecowboytest@gmail.com" 

# End of Email Functionality
