import datetime
import base64
def b64encode(data: bytes):
	return base64.b64encode(data).decode('ascii') # Dumb library gives base64 output as bytes, so we must decode it.

from .models import Conversation, ConversationParticipant, Message
from authenticate.models import CustomUser as User

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.shortcuts import render
from rest_framework.decorators import api_view

def get_participants_data(conversation: Conversation, exclude_user_id: int):
	return [ # list comprehension: for participant
		{
			'name': participant.user.get_full_name(),
			'id': participant.user.id,
		} for participant in conversation.participants.exclude(user__id=exclude_user_id).all()
	]

def get_conversation_data(conversation: Conversation, user_id, only_last_message=False):
	# Ensure given user is a participant
	user: ConversationParticipant | None = conversation.participants.filter(user__id=user_id)[0]
	if user is None:
		raise Exception('The given user id does not belong to the requested conversation.')

	data = {
		'participants': get_participants_data(conversation, user_id),
		'id': conversation.id,
		'key': b64encode(user.encrypted_key),
	}
	print(data['participants'])
	if only_last_message:
		data['last_message'] = conversation.get_last_message().json_serializable()
	else:
		oldest_to_look_for = datetime.datetime.now(datetime.UTC)
		oldest_to_look_for -= datetime.timedelta(days=30)
		messages = Message.objects \
			.filter(conversation__id=conversation.id, date__gte=oldest_to_look_for) \
			.order_by('-date')[:20]
		data['messages'] = [m.json_serializable() for m in messages[::-1]]

	return data

@api_view(['GET'])
def conversation(request, conversation_id):
	user_id = request.user.id
	if user_id is None:
		return HttpResponseForbidden('You are not logged in.')
	if not Conversation.available_to_user(conversation_id, user_id):
		return HttpResponseBadRequest('The conversation does not exist or you are not a part of it.')

	conversation = Conversation.objects.get(id=conversation_id)
	return JsonResponse(get_conversation_data(conversation, user_id))

@api_view(['POST'])
def make_conversation(request):
	user_id = request.user.id
	if user_id is None:
		return HttpResponseForbidden('You are not logged in.')
	data = request.data
	# verify all users exist
	for key in data:
		other_user = User.objects.filter(id=int(key)).first()
		if other_user is None:
			return HttpResponseBadRequest('The requested user does not exist.')
		# TODO: Check that the requested user shares a group with the requester?

	# Make the conversation and set it up
	conversation = Conversation.objects.create()
	p: ConversationParticipant
	for key in data:
		p = ConversationParticipant.objects.create(user_id=int(key), encrypted_key=data[key].read())
		conversation.participants.add(p)

	conversation.save()
	return JsonResponse(get_conversation_data(conversation, user_id))


@login_required(login_url='authenticate-login') # This might not be the best way to do this? Idk, but it's easy pz.
def all_conversations(request):
	user_id = request.user.id
	user_conversations = Conversation.objects.filter(participants__user__id=user_id).all()

	existing_conversations = [get_conversation_data(c, user_id, True) for c in user_conversations]

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

@api_view(['POST'])
def get_public_keys(request):
	user: User = request.user
	if not user.is_authenticated:
		return HttpResponseForbidden('You are not logged in.')

	user_ids: list = request.data
	user_ids.append(user.id)

	id: int
	keys = []
	for id in user_ids:
		user = User.objects.filter(id=id).first()
		if user is None:
			return HttpResponseBadRequest('The requested user does not exist.')
		keys.append({
			'public_key_b64': base64.b64encode(user.public_key).decode('ascii'), # Dumb library gives base64 output as bytes, so we must decode it.
			'user_id': id,
		})

	return JsonResponse(keys, safe=False) # safe=False: "Before the 5th edition of ECMAScript it was possible to poison the JavaScript Array constructor."
