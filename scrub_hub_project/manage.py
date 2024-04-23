#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def validate_dependencies_installed():
	from importlib import metadata
	# Read requirements file
	with open('requirements.txt', 'r') as fs:
		lines = fs.readlines()

	for line in lines:
		# Line may include ending newline and/or ==version
		if line[-1] == '\n':
			line = line[:-1]
		try:
			index = line.index('==')
			line = line[:index]
		except ValueError:
			pass # If line didn't contain '==', that's OK.

		try:
			metadata.distribution(line)
		except:
			return False
	return True

def main():
	"""Run administrative tasks."""
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scrub_hub_project.settings")
	try:
		from django.core.management import execute_from_command_line
	except ImportError as exc:
		raise ImportError(
			"Couldn't import Django. Are you sure it's installed and "
			"available on your PYTHONPATH environment variable? Did you "
			"forget to activate a virtual environment?"
		) from exc
	execute_from_command_line(sys.argv)


if __name__ == "__main__":
	# We validate that dependencies are installed first, so that we can give the user a helpful message if they aren't.
	first_start = os.environ.get('DJANGO_HAS_STARTED') is None
	if first_start and not validate_dependencies_installed():
		import sys
		if sys.prefix == sys.base_prefix:
			print('You aren\'t using a Python virtual environment. If you have one, make sure it is activated. See README.md for details.')
		raise Exception(f'One or more required Python package was not found. Try installing with pip install -r requirements.txt')
	os.environ['DJANGO_HAS_STARTED'] = 'True'
	main()
