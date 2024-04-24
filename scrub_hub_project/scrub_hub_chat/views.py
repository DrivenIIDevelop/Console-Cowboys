from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.shortcuts import render
import datetime

from .models import Conversation, Message
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def conversation(request, conversation_id):
	user_id = request.user.id
	if user_id is None:
		return HttpResponseForbidden('You are not logged in.')
	if not Conversation.available_to_user(conversation_id, user_id):
		return HttpResponseBadRequest('The conversation does not exist or you are not a part of it.')

	conversation = Conversation.objects.get(id=conversation_id)
	oldest_to_look_for = datetime.datetime.now(datetime.UTC)
	oldest_to_look_for -= datetime.timedelta(days=30)
	messages = Message.objects \
		.filter(conversation__id=conversation_id, date__gte=oldest_to_look_for) \
		.order_by('-date')[:20]
	data = {
		'participants': [p.user.username for p in conversation.participants.exclude(user__id=user_id).all()],
		'messages': [
			{
				'message': m.text.decode(),
				'username': m.user.username,
				'time': str(m.date),
			} for m in messages[::-1]
		],
		'conversation_id': conversation_id,
	}
	return JsonResponse(data)

@login_required(login_url='authenticate-login') # This might not be the best way to do this? Idk, but it's easy pz.
def all_conversations(request):
	user_id = request.user.id
	user_conversations = Conversation.objects.filter(participants__user__id=user_id).all()
	context = {
		'conversationListComponentProps': {
			'conversations': [
				{
					'participants': [p.user.username for p in c.participants.exclude(user__id=user_id).all()],
					'last_message_time': str(c.last_message_date or datetime.datetime.now(datetime.UTC)),
					'id': c.id,
				} for c in user_conversations
			],
		},
	}
	return render(request, 'scrub_hub_chat/index.html', context)
