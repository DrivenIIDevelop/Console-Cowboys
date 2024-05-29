# Channels (the library handling async connections) "consumers"
# analagous to Django's "views"

import datetime

from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import InMemoryChannelLayer

from authenticate.models import CustomUser
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
	scope: dict
	user: CustomUser | None

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.ignore = None
		self.conversation_id = -1

	def get_users_in_conversation(self):
		users = []
		query = Conversation.objects.filter(id=self.conversation_id)
		if query.count() == 1:
			conversation = query[0]
			for participant in conversation.participants.all():
				users.append(str(participant.user.id))
		self.users_in_conversation = users


	def connect(self):
		self.user = self.scope.get('user', None)
		if self.user is None:
			self.close(401) # This method has a "reason" parameter, but that reason is not visible to the client. Weird.
			return

		# We'll get the conversation ID from the request URL. Negative value indicates the conversation is not yet initialized.
		id: int = self.scope['url_route']['kwargs']['conversation_id']
		if (id >= 0):
			self.set_conversation(id)

		# Add this consumer instance to a group for this user.
		# This will allow other consumer instances to send messages to this user, using the same id-as-group-name, to any and all tabs this user has open.
		self.group_add(str(self.user.id))
		self.accept()

	def set_conversation(self, id):
		self.conversation_id = id
		self.get_users_in_conversation()
		# Validate that this user is part of the conversation
		if str(self.user.id) not in self.users_in_conversation:
			self.close(403)
			return

	def receive_json(self, data):
		if 'created' in data:
			self.set_conversation(data['created'])
			return

		msg_txt: str = data.get('message', None)
		iv: str = data.get('iv', None)
		sender_msg_id: int = data.get('id', None)
		if type(msg_txt) != str or type(sender_msg_id) != int or type(iv) != str:
			raise Exception('Invalid data received.')

		message = {
			'message': msg_txt,
			'iv': iv,
			'username': self.user.get_full_name(),
			'time': str(datetime.datetime.now(datetime.UTC)),
			'type': 'chat_message', # Tells channels what method to use to handle the group message.
		}
		# Add message to database
		Message(text=msg_txt, iv=iv, conversation_id=self.conversation_id, user=self.user).save()

		# Echo back to the sender so they know it's been received
		self.send_json({ 'received': sender_msg_id })
		# We are going to send the message to all participants, including the user who sent it.
		# If they have two tabs open, this allows the message to appear on their other tab.
		# But, we will not send it back on the same tab that it first came from.
		self.ignore = message
		# Forward the message to each user in the conversation
		for id in self.users_in_conversation:
			self.group_send(id, message)

	# This is a handler for "group_send". group_send will get and call a function with the name of the message's "type" value.
	def chat_message(self, event):
		if self.ignore == event: # This client already has the message (because they sent it)
			self.ignore = None
			return

		del event['type']
		self.send_json(event)
