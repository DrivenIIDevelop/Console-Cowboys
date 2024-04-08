# Console-Cowboys

This repository is for the DevC 1.0 hackathon, and the Console Cowboys team. We will be building a "Healthcare Communication and Collaboration Software".

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
