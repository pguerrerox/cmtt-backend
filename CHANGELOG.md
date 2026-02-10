# Changelog
All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning.

## Next Steps
- Review code for the merged changes... proceed with the routes.

## Changes

### 0.0.7 - dynamic column mapping - 2026-02-10
- Expanded project repository helpers to support modify/delete and new lookup variants.
- Refactored project creation/update to use dynamic column mapping.
- Updated project routes to add PATCH/DELETE endpoints and rely on project services.
- Updated `db/databases/dev_main.db`.

### 0.0.6 - (chore(db): env + path fix) - 2026-02-10
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
