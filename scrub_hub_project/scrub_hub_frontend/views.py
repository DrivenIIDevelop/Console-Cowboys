from django.shortcuts import render

def index(request):
	return render(request, 'scrub_hub_frontend/index.html')
