from django.http import JsonResponse
from django.shortcuts import render
import datetime

from .models import Conversation, Message
from django.contrib.auth.models import User

# Create your views here.
def conversation(request, conversation_id):
	# TODO: Auth, and ensure user belongs to requested conversation
	user_id = User.objects.get(username='chattest 1').id # TODO: Get user from request
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

def all_conversations(request):
	user_id = User.objects.get(username='chattest 1').id # TODO: Get user from request
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
