# Changelog
All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning.


## Changes

### 0.1.0 - 2026-02-11 - managers route/repo cleanup and auth removal
- Removed deprecated auth files: `_x_auth.js` and `routes/_x_auth.routes.js`.
- Removed deprecated schema file: `db/schema/_x_settings.schema.js`.
- Refactored `repositories/managers.repo.js` to return structured `{ ok, data|message|error }` responses.
- Updated admin manager routes to use repository result objects and aligned HTTP status codes (`201` for create, `200` for update).
- Reworked public manager routes to use repository reads and standardized endpoint paths:
  - `GET /managers`
  - `GET /manager/name/:name`
  - `GET /manager/id/:id`
- Improved repository/module documentation comments in managers/projects modules.

### 0.0.7 - 2026-02-10 - dynamic column mapping
- Expanded project repository helpers to support modify/delete and new lookup variants.
- Refactored project creation/update to use dynamic column mapping.
- Updated project routes to add PATCH/DELETE endpoints and rely on project services.
- Updated `db/databases/dev_main.db`.

### 0.0.6 - 2026-02-10 - (chore(db): env + path fix)
- Load environment variables in `db/db.js` so `DB_PATH` is available before DB initialization.
- Resolve database path relative to the module directory for consistent path resolution.

### 0.0.5
- Working on `projects_services` and `project_routes`.

### 0.0.4
- Planning at home.

### 0.0.3
- Completed `managers_services` and `admin_routes` related to managers.

### 0.0.2
- Started refactoring based on new logic.

### 0.0.1
- First version after splitting the code base between front and back ends.
