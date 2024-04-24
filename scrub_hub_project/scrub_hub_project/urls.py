"""
URL configuration for scrub_hub_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from django.views.generic import TemplateView


#Can use for dist
def index_view(request):
    return render(request, 'index.html')

# HTTP
urlpatterns = [
	path("admin/", admin.site.urls),
	
	path('authenticate/', include('authenticate.urls')), #may need a different pathing strategy later to render other apps as well
	path('', include('scrub_hub_frontend.urls')),
	path('api/', include('email_app.urls')),
	path('notes/', include('patient_notes.urls')),
	path('messages/', include('scrub_hub_chat.urls')),
]

# Websocket
from scrub_hub_chat import consumers
websocket_urlpatterns = [
	path("ws/", consumers.ChatConsumer.as_asgi()),
]
