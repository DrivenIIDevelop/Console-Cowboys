# Channels (the library handling async connections) "consumers"
# analagous to Django's "views"

import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
	def connect(self):
		self.accept()
		# test
		self.send(text_data=json.dumps({"message": 'hello there'}))

	def disconnect(self, close_code):
		pass

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json["message"]
