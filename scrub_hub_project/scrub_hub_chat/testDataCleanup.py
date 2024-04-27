# Companion to testDataSetup.py. Removes the test data from the database.

from django.contrib.auth.models import User
from scrub_hub_chat.models import Conversation

# Assign so the return value isn't printed (since we will run in "interactive" mode)
_ = Conversation.objects.filter(participants__user__username__startswith='chattest ').delete()
_ = User.objects.filter(username__startswith='chattest ').delete()
# ConversationParticipant objects should be automatically deleted
