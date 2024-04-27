# Companion to testDataSetup.py. Removes the test data from the database.

from authenticate.models import CustomUser as User
from scrub_hub_chat.models import Conversation

# Assign so the return value isn't printed (since we will run in "interactive" mode)
_ = Conversation.objects.filter(participants__user__first_name='chattest').delete()
_ = User.objects.filter(first_name='chattest').delete()
# ConversationParticipant objects should be automatically deleted
