from django.shortcuts import render

def index(request):
	return render(request, 'scrub_hub_frontend/index.html')


def send_simple_message():
	return requests.post(
		"https://api.mailgun.net/v3/sandbox8b286874e61244339fc3acedffa31c50/messages",
		auth=("api", "4b670513-2c867c8b"),
		data={"from": "Excited User <consolecowboytest@gmail.com>",
			"to": ["bar@example.com", "swordgeo1094@yahoo.com"],
			"subject": "Hello",
			"text": "Testing some Mailgun awesomeness!"})