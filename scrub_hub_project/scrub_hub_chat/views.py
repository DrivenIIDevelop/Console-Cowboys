from django.shortcuts import render

# Create your views here.
def test(request):
	context = {
		'chatComponentProps': {
			'participants': [ 'Alice', 'Bob '],
		},
	}
	return render(request, 'scrub_hub_chat/index.html', context)
