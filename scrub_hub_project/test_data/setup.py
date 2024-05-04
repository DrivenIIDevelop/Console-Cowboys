# Use this to set up test data.
# This script should not be run directly, but through the Django shell, from the project root.
# Do this with: python manage.py shell < test_data/setup.py
# Output will be rather messy, since it's running interactive mode.
# OR, run python manage.py shell then manually import this file and run main.

# Do not run this script directly!
if __name__ == '__main__':
	print('This script should not be run directly! Run it through Django\'s shell.')
	exit()

from test_data import chat
from test_data import notes

def main():
	chat.setup()
	notes.setup()

main()
