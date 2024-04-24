# Use this to set up test data so you can test out the chat functionality.
# This script should not be run directly, but through the Django shell.
# Do this with: python manage.py shell < scrub_hub_chat/testDataSetup.py
# Output will be rather messy, since it's running interactive mode.

from django.contrib.auth.models import User
from scrub_hub_chat.models import Conversation, ConversationParticipant

# Check if test data already exists
if User.objects.filter(username__startswith='chattest ').count() != 0:
	print('\nTest data already exists. If you need to re-run testDataSetup, first run testDataCleanup.')
	exit()

print('\nCreating test users...')
u1 = User(username='chattest 1', password='test'); u1.save()
u2 = User(username='chattest 2', password='test'); u2.save()
u3 = User(username='chattest 3', password='test'); u3.save()

# Not making conversations anymore, since there's a simple UI to do so.
