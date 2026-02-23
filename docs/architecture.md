# Architecture

## System Context
- `apps/frontend` consumes REST endpoints from `apps/backend`.
- `apps/backend` persists data in SQLite and exposes manager/project APIs.
- Operations plan source data is loaded through an explicit one-shot import command (`operations:import`).
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

## Data Flow (Operations Import)
1. Operator/scheduler runs `npm run operations:import` from monorepo root.
2. Backend loads and normalizes workbook rows from `_ref-external-data/testData.xls`.
3. Worker upserts rows into `operations_planned_dates`.
4. New project creation and lookup worker use refreshed operations data.
