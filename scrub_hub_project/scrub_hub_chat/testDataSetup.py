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

print('\nSetting up conversation...')
c = Conversation()
c.save() # must save to give it an id, before participants can be added
p1 = ConversationParticipant(user=u1); p1.save()
p2 = ConversationParticipant(user=u2); p2.save()
c.participants.set([p1, p2])
c.save()
