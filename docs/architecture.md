# Architecture

## System Context
- `apps/frontend` consumes REST endpoints from `apps/backend`.
- `apps/backend` persists data in SQLite and exposes manager/project APIs.
- Queue reconciliation is handled by the one-shot lookup worker (`worker:projects-lookup`) triggered by an external scheduler.

## Backend Components
- `routes/`: API endpoints.
- `repositories/`: database access and business rules.
- `db/schema/`: table definitions.
- `workers/`: recurrent/offline processing.
- `tests/`: unit and route tests.

## Data Flow (Project Creation)
1. Client creates a project.
2. Backend checks operations plan data.
3. If operations data exists, project is enriched immediately.
4. If missing, project is enqueued for retry by worker.
5. Scheduled worker retries and enriches project later when data becomes available.
