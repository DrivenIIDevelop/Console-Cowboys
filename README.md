# Console-Cowboys

This repository is for the DevC 1.0 hackathon, and the Console Cowboys team. We will be building a "Healthcare Communication and Collaboration Software".

## Contributing

If you are a member of the Console Cowboys, you should have permissions to push to this repository except for the main branch.
To contribute, create a new branch (or fork). Make your commits there and push that branch/fork. Then you can create a pull request when you are ready to have your changes integrated into the main branch.

## Developing

### Setup

This project requires that Python and Node.js be installed. Depending on your Python installation, python commands below may require that you type `python3` instead of `python`.

To set up your development environment, you'll need to install the Python dependencies listed in requirements.txt. It is recommended that you first set up a Python virtual environment:
* Ensure your current directory is /scrub_hub_project (and not /scrub_hub_project/scrub_hub_project)
* Create virtual environment: `python -m venv venv` (do this only once after cloning)
* Activate virtual environment: (do this every time you open a new terminal)
	* Windows: `venv\Scripts\activate`
	* Linux/Mac: `source venv/bin/activate`
* Install Python dependencies:  `pip install -r requirements.txt` (do this once after cloning and whenever requirements.txt is updated)

If we require any further pip dependencies, please add them to scrub_hub_project\requirements.txt

You will also need to install dependencies from package.json:
* Ensure your current directory is /scrub_hub_vite
* Install dependencies: `npm install` (do this once after cloning and whenever dependencies in package.json are updated)

### Running the project

To run in dev mode, you need two terminals to start Vite and Django:
* From scrub_hub_project: `python manage.py runserver`
* From scrub_hub_vite: `npm run dev`

Then open localhost:8000 (Django's port) in a browser.

If this doesn't work, ensure you have the dependencies installed and your Python virtual environment is active. (See above "Setup" section.)

Production mode isn't fully set up and probably never will be for this MVP.

## Features, requirements

We have the following features as things we plan to implement in some way:
* Secure, real-time messaging: End-to-end encrypted messaging for secure communication and instant chat functionality for quick communication.
* Email integration: Seamless integration with email platforms.
* Authentication and signup/login: User authentication system to allow users to securely log in to the platform.
* Task Management: Assign tasks, set deadlines, and track progress.
Potential features which may or may not be implemented:
* Integration with EHR/EMR: Seamless integration with Electronic Health Records. (Likely we'll just mock this.)

## Project structure

The current plan for the architecture seems to be:
* Use React + TypeScript for the front end.
* Use Django and SQL for the backend.
	* Should we install a SQL server, or can we use SQLite (which Djando projects use by default)?
