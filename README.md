<div align="center">
<img width=200 src="public/derivative.svg" onClick="https://derivative.lol">

# Derivative: An Open Source BP Debate Tracker
</div>

Currently live on [derivative.lol](https://derivative.lol). This is the front-end of a tracker designed for British Parliamentary debating, allowing users record and import results, view their history, and access summary statistics. The back-end is visible [here](https://github.com/vikwritescode/bp-debate-tracker).

Built with React, Tailwind, Vite, shadcn, and Firebase. All code is made available under the [GNU AGPLv3](https://github.com/vikwritescode/bp-tracker-frontend/blob/main/LICENSE.md) license.

## Features
- Add debate results
- Import from [TabbyCat](https://tabbycat.readthedocs.io/en/stable/) URLs
- Track performance over time
- View and manage history
- User registration and authentication
- Automatic motion categorisation

## Setup Instructions
Create a new project on Firebase, adding authentication and a web app from the overview screen. Add a .env file to the repo's root folder, with `VITE_FIREBASE_{API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID}`; for each, copy the value of the corresponding entry in the `firebaseConfig` object of the web app you've created, visible from your Firebase project settings.

Finally, add `VITE_API_URL` to your .env, pointing towards the address of your backend API instance. The frontend can then be launched using `npm run dev` from its root folder.
