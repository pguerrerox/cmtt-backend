# CMTT Backend

Backend API and database for the Commitment Managers Tracking Tool. This service supports commitment managers as they track ongoing projects.

## What This Is
- Node.js + Express REST API
- SQLite database via `better-sqlite3`
- Auth and admin routes for project management workflows

## Local Development
1. Install dependencies:
   `npm install`
2. Configure environment variables (see below).
3. Run the server:
   `npm run start`

## Environment Variables
Create a `.env` file in the project root.

- `PORT` (optional, default `5000`)
- `DB_PATH` (optional, default `../databases/dev_main.db`, resolved relative to `db/db.js`)

## Scripts
- `npm run start` starts the API with `nodemon`.
- `npm test` runs the test suite with Node's built-in test runner.

## Changelog
See `CHANGELOG.md`.
