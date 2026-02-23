# CMTT Frontend

React + Vite frontend for the Commitment Managers Tracking Tool.

## Pages
- `/`: manager selector (`GET /api/managers`), create-project CTA, and projects list (`GET /api/projects`).
- `/admin`: admin manager view (`GET /api/admin/managers`) and manager creation form (`POST /api/admin/createManager`) with radio-role selection.
- `/projects/new`: project creation form (`POST /api/createProject`) without planned date fields.

Manager create roles: `Team Leader`, `Senior Project Manager`, `Project Manager` (default), and `Guest`.

## Development
- From monorepo root run `npm install`.
- Start frontend: `npm run dev:frontend`.
- Set `VITE_API_BASE_URL` if backend is not on `http://localhost:5000`.
