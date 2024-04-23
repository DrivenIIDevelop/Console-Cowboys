# Channels (the library handling async connections) "consumers"
# analagous to Django's "views"

import datetime

from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import InMemoryChannelLayer

from django.contrib.auth.models import User
from .models import Conversation, Message

# "We recommend that you write SyncConsumers by default": https://channels.readthedocs.io/en/stable/topics/consumers.html#basic-layout
class GroupedConsumer(JsonWebsocketConsumer):
	# Note: Code analysis thinks self.channel_layer is type Any | None
	# To fix that, we use a type annotation here.
	channel_layer: InMemoryChannelLayer
	groups: list[str]

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.groups = []

	def group_add(self, group):
		async_to_sync(self.channel_layer.group_add)(group, self.channel_name)
		self.groups.append(group)

	def group_send(self, group, event):
		async_to_sync(self.channel_layer.group_send)(group, event)

	def disconnect(self, code):
		# I would think that the base class handles this already. But it doesn't!
		for group in self.groups:
			async_to_sync(self.channel_layer.group_discard)(group, self.channel_name)

class ChatConsumer(GroupedConsumer):
	"""
	Each user will be placed in a "group" that is only for that user.
	This group will make it so that a user can have multiple tabs open and see notifications on all of them.
	We do not have a group for the current conversation. Maybe this will change at some point.
	"""

	def get_user_id(self):
		# Auth isn't implemented yet
		# self.scope['user'] ... TODO
		users = User.objects.filter(username='chattest 1')
		if users.count() == 1:
			self.user = users[0]
		else:
			raise Exception('Did not find test user.')

	def get_users_in_conversation(self):
		conversation = Conversation.objects.get(id=self.conversation_id)
		users = []
		for participant in conversation.participants.all():
			if participant.user.id == self.user.id:
				continue
			users.append(str(participant.user.id))
		self.others_in_conversation = users


	def connect(self):
		self.get_user_id()
		self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
		self.get_users_in_conversation()
		self.group_add(str(self.user.id))
		self.accept()

	def receive_json(self, data):
		msg_txt: str = data.get('message', None)
		sender_msg_id: int = data.get('id', None)
		if type(msg_txt) != str or type(sender_msg_id) != int:
			raise Exception('Invalid data received.')
		# TODO: Encrypt msg
		msg_blob = msg_txt.encode()

		message = {
			'message': msg_txt,
			'username': self.user.username,
			'time': str(datetime.datetime.now(datetime.UTC)),
			'type': 'chat_message', # Tells channels what method to use to handle the group message.
		}
		# Add message to database
		Message(text=msg_blob, conversation_id=self.conversation_id, user=self.user).save()

		# Forward the message to each user in the conversation
		for id in self.others_in_conversation:
			self.group_send(id, message)
		# Echo back to the sender so they know it's been received
		self.send_json({ 'received': sender_msg_id })

	# This is a handler for "group_send". group_send will get and call a function with the name of the message's "type" value.
	def chat_message(self, event):
		del event['type']
		self.send_json(event)
