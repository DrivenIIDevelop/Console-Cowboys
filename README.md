# Console-Cowboys

This repository is for the DevC 1.0 hackathon, and the Console Cowboys team. Our project for this hackathon is "Healthcare Communication and Collaboration Software".

The hackathon officially ended on May 5th with our hackathon presentations. At this point, we've implemented most of the backend features that were originally planned, along with most of the individual user interface components although they are not really well integrated at this point.

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

The project is set up with a backend and frontend project.

Frontend, at /scrub_hub_vite:
* We used React to build our user interface.
* Code is written in TypeScript.
* TailwindCSS and some regular CSS is used for styling.
* This is set up in a Vite project, and requires node.js for building.

Backend, at /scrub_hub_project:
* We used Django as our web server. Serves pages and our API endpoints.
* We have one Django project, and separate Django "apps" for various contributors' assigned features.
* Our data is currently in a SQLite database. Migration to a more proper SQL server in production should be made easy by Django's SQL integrations.

## Tailwind CSS
This is to have a standard CSS styling for our application. Tailwind provides a cleaner and fast way to style components.

https://tailwindcss.com/docs/guides/create-react-app
Followed the above link to set up Tailwind CSS.

You can install TailwindCSS Intellisense extension to help with autocomplete and syntax. (Prettier is another option as well, or both)

Configuration: https://tailwindcss.com/docs/configuration
You can also specify specific parameters for your whole project in tailwind.config.js in theme: https://tailwindcss.com/docs/theme
such as colors, or screen size definitions.

You can add specific values to your components here, such as <div class="top-[117px]">
https://tailwindcss.com/docs/adding-custom-styles

But really, you don't need to modify the index.css class, usually you would just
specify it in the code as shown below (examples given):
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/building.jpg" alt="Modern building architecture">
    </div>
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Company retreats</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Incredible accommodation for your team</a>
      <p class="mt-2 text-slate-500">Looking to take your team away on a retreat to enjoy awesome food and take in some sunshine? We have a list of places to do just that.</p>
    </div>
  </div>
</div>
