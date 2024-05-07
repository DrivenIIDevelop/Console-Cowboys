from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.shortcuts import render
import datetime

from .models import Conversation, ConversationParticipant, Message
from authenticate.models import CustomUser as User
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

def get_conversation_data(conversation, user_id):
	oldest_to_look_for = datetime.datetime.now(datetime.UTC)
	oldest_to_look_for -= datetime.timedelta(days=30)
	messages = Message.objects \
		.filter(conversation__id=conversation.id, date__gte=oldest_to_look_for) \
		.order_by('-date')[:20]
	data = {
		'participants': [
			{
				'name': p.user.get_full_name(),
				'id': p.user.id,
	 		} for p in conversation.participants.exclude(user__id=user_id).all()],
		'messages': [
			{
				'message': m.text.decode(),
				'username': m.user.get_full_name(),
				'time': str(m.date),
			} for m in messages[::-1]
		],
		'conversation_id': conversation.id,
	}
	return JsonResponse(data)

@api_view(['GET'])
def conversation(request, conversation_id):
	user_id = request.user.id
	if user_id is None:
		return HttpResponseForbidden('You are not logged in.')
	if not Conversation.available_to_user(conversation_id, user_id):
		return HttpResponseBadRequest('The conversation does not exist or you are not a part of it.')

	conversation = Conversation.objects.get(id=conversation_id)
	return get_conversation_data(conversation, user_id)

@api_view(['GET'])
def make_conversation(request, with_user_id):
	user_id = request.user.id
	if user_id is None:
		return HttpResponseForbidden('You are not logged in.')
	# verify other user exists
	other_user = User.objects.filter(id=with_user_id).first()
	if other_user is None:
		return HttpResponseBadRequest('The requested user does not exist.')
	# TODO: Check that the requested user shares a group with the requester?

	# Make the conversation and set it up
	conversation = Conversation()
	conversation.save() # must save to give it an id, before participants can be added
	p1 = ConversationParticipant(user=request.user); p1.save()
	p2 = ConversationParticipant(user=other_user); p2.save()
	conversation.participants.set([p1, p2])
	conversation.save()

	return get_conversation_data(conversation, user_id)


@login_required(login_url='authenticate-login') # This might not be the best way to do this? Idk, but it's easy pz.
def all_conversations(request):
	user_id = request.user.id
	user_conversations = Conversation.objects.filter(participants__user__id=user_id).all()

	existing_conversations = [
		{
			'participants': [
				{
					'name': p.user.get_full_name(),
					'id': p.user.id,
		 		} for p in c.participants.exclude(user__id=user_id).all()],
			'last_message_time': str(c.last_message_date or datetime.datetime.now(datetime.UTC)),
			'id': c.id,
		} for c in user_conversations
	]
	# For now, user may start a conversation with any user who they don't already have a conversation with
	# TODO: This probably should be made better at some point.
	available_users = []
	for user in User.objects.all():
		if user.id != user_id and user_conversations.filter(participants__user__id=user.id).count() == 0:
			available_users.append({
				'name': user.get_full_name(),
				'id': user.id
			})

	context = {
		'conversationListComponentProps': {
			'conversations': existing_conversations,
			'available_users': available_users,
		},
	}
	return render(request, 'scrub_hub_chat/index.html', context)
