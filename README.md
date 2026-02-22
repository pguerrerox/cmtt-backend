# CMTT

Monorepo for the Commitment Managers Tracking Tool.

## Structure
- `apps/backend`: Node.js + Express API, SQLite schemas/repos, workers, tests.
- `apps/frontend`: React + Vite UI for admin/manager/project workflows.
- `packages`: Shared packages across backend/frontend.
- `docs`: Architecture and API documentation.

## Workspace Commands
- `npm run dev:backend` starts the backend API.
- `npm run test:backend` runs backend tests.
- `npm run worker:projects-lookup` runs one lookup worker pass.
- `npm run dev:frontend` starts the frontend app.
- `npm run build:frontend` builds the frontend app.

## Versioning Policy
- Backend (`apps/backend`) and frontend (`apps/frontend`) are versioned independently.
- Use semantic versioning per app (`MAJOR.MINOR.PATCH`).
- Tag releases by app: `backend-vX.Y.Z` and `frontend-vX.Y.Z`.
- Keep the root package version for workspace/tooling metadata only.

## Getting Started
1. Install dependencies from repo root: `npm install`
2. Add backend env vars in `apps/backend/.env`
3. Run backend: `npm run dev:backend`
