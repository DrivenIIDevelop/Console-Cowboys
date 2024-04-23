# Channels (the library handling async connections) "consumers"
# analagous to Django's "views"

import datetime

from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import InMemoryChannelLayer

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
		ChatConsumer.mock_user_id += 1
		self.user_id = ChatConsumer.mock_user_id

	def get_users_in_conversation(self, conversation_id):
		# Nothing in the database is set up yet. TODO
		users = []
		for id in range(1, ChatConsumer.mock_user_id + 1):
			if id == self.user_id:
				continue
			users.append(str(id))
		return users


	def connect(self):
		self.get_user_id()
		self.group_add(str(self.user_id))
		self.accept()

	def receive_json(self, data):
		message = {
			'message': data['message'],
			'username': f'Guest user {self.user_id}',
			'time': str(datetime.datetime.now(datetime.UTC)),
			'type': 'chat_message', # Tells channels what method to use to handle the group message.
		}
		# TODO: Add message to database

		# Forward the message to each user in the conversation
		for id in self.get_users_in_conversation(0):
			self.group_send(id, message)

	# This is a handler for "group_send". group_send will get and call a function with the name of the message's "type" value.
	def chat_message(self, event):
		del event['type']
		self.send_json(event)
ChatConsumer.mock_user_id = 0
