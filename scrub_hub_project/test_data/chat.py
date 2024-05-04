# Use this to set up test data so you can test out the chat functionality.
# The functions defined in this file should be run through the Django shell. (See setup.py)

from authenticate.models import CustomUser as User
from scrub_hub_chat.models import Conversation

def setup():
	# Check if test data already exists
	if User.objects.filter(first_name='chattest').count() != 0:
		print('\nTest data already exists. If you need to re-run testDataSetup, first run testDataCleanup.')
		exit()

	print('\nCreating test users...')
	user_info = { 'first_name': 'chattest' } # Other fields are specified in REQUIRED_FIELDS but no errors are raised if they aren't present.
	users = []
	for i in range(3):
		u = User(last_name=str(i), email=f'chattest{i}@scrubhub.com', **user_info)
		u.set_password('test')
		u.save()
		users.append(u)

	# Not making conversations anymore, since there's a simple UI to do so.

def cleanup():
	Conversation.objects.filter(participants__user__first_name='chattest').delete()
	User.objects.filter(first_name='chattest').delete()
	# ConversationParticipant objects should be automatically deleted
