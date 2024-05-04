# Companion to testDataSetup.py. Removes the test data from the database.

# Do not run this script directly!
if __name__ == '__main__':
	print('This script should not be run directly! Run it through Django\'s shell.')
	exit()

from test_data import chat
from test_data import notes

def main():
	chat.cleanup()
	notes.cleanup()

main()
