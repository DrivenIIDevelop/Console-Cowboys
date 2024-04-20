from django.shortcuts import render

def index(request):
	objectToPassToReact = {
		'initialCount': 42,
		'someString': '"Quotes" work, \\backslashes\\ work, <tags> work.'
	}
	# We will pass the object via Django's rendering context
	# This context should be a dictionary.
	# You can use whatever key you want; you'll get data from the context by using the key in the HTML template.
	context = { 'data': objectToPassToReact }
	return render(request, 'scrub_hub_frontend/index.html', context)
