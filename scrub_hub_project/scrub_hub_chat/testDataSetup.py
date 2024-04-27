# Use this to set up test data so you can test out the chat functionality.
# This script should not be run directly, but through the Django shell.
# Do this with: python manage.py shell < scrub_hub_chat/testDataSetup.py
# Output will be rather messy, since it's running interactive mode.

from authenticate.models import CustomUser as User

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
