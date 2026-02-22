# CMTT Backend

Backend API and database for the Commitment Managers Tracking Tool. This service supports commitment managers as they track ongoing projects.

## What This Is
- Node.js + Express REST API
- SQLite database via `better-sqlite3`
- Auth and admin routes for project management workflows

## Local Development
1. Install dependencies from monorepo root:
   `npm install`
2. Configure environment variables (see below).
3. Run the server from monorepo root:
   `npm run dev:backend`

## Environment Variables
Create a `.env` file in `apps/backend`.

- `PORT` (optional, default `5000`)
- `DB_PATH` (optional, default `../databases/dev_main.db`, resolved relative to `db/db.js`)
- `LOOKUP_BATCH_SIZE` (optional, default `50`)
- `LOOKUP_RETRY_DELAY_MS` (optional, default `3600000`)
- `LOOKUP_MAX_ATTEMPTS` (optional, default `8`)

## Scripts
- `npm run start` starts the API with `nodemon`.
- `npm test` runs the test suite with Node's built-in test runner.
- `npm run worker:projects-lookup` runs a single lookup-queue worker pass.

From repo root, use workspace wrappers:
- `npm run dev:backend`
- `npm run test:backend`
- `npm run worker:projects-lookup`

## Recurrent Lookup Worker
- The queue reconciliation runs as a one-shot worker command and should be triggered by an external scheduler.
- Recommended trigger: OS cron, container cron, or platform scheduled job.
- Example cron (every 15 minutes):
  `*/15 * * * * cd /path/to/cmtt-monorepo && npm run worker:projects-lookup >> /var/log/cmtt-worker.log 2>&1`

## Changelog
See `CHANGELOG.md`.
