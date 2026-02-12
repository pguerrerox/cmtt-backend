# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-02-12

### Added
- Added `TODO.md` project task tracker.
- Added new Excel import module structure under `helpers/excel_import/`:
  - `index.js` (pipeline entrypoint)
  - `config.js` (headers/output shape config)
  - `transform.js` (row-group transformation)
  - `normalize.js` (date normalization)

### Changed
- Refactored Excel ingestion flow to use the new `helpers/excel_import` structure.
- Updated helper test runner to import from `helpers/excel_import/index.js`.
- Moved Excel source file location to `_ref-external-data/testData.xls`.
- Updated XLSX dependency source to SheetJS CDN tarball (`0.20.3`) to resolve file access/runtime compatibility.

### Removed
- Removed legacy Excel helper files:
  - `helpers/excel_DataReadyForSQLite.js`
  - `helpers/excel_CleanedData.js`
  - `helpers/excel_DateConverter.js`
  - `helpers/excel_Range.js`
- Removed deprecated helper dataset `helpers/data_active_managers.js`.

## [0.2.0] - 2026-02-12

### Added
- Added field allowlists for dynamic payload validation:
  - `helpers/_ALLOWED_PROJECT_FIELDS.js`
  - `helpers/_ALLOWED_MANAGER_FIELDS.js`
- Added project read endpoints in `routes/projects.routes.js`:
  - `GET /projects`
  - `GET /projects/manager/:manager_id`
  - `GET /projects/customer/:customer_name`
  - `GET /projects/:project_number`
- Added route/module JSDoc blocks and endpoint documentation for projects/admin-manager routes.

### Changed
- Enforced `project_number` as required at schema level: `db/schema/project.schema.js` (`UNIQUE NOT NULL`).
- Refactored `repositories/projects.repo.js` to use:
  - dynamic create/update SQL
  - payload validation with dropped-key reporting
  - consistent structured responses (`{ ok, data|message|error }`)
  - consistent DB/constraint error handling
- Refactored `repositories/managers.repo.js` to match the same dynamic/validated repository pattern and response contract.
- Updated `routes/projects.routes.js` to:
  - import from `repositories/projects.repo.js`
  - use structured repository results and consistent HTTP status mapping (`400/404/409/500`)
  - return router directly (`export default router`)
- Updated `routes/admin.routes.js` and `routes/managers.routes.js` with consistent status mapping based on repository errors.
- Updated admin manager update endpoint from `PUT` to `PATCH`:
  - `PATCH /admin/updateManager/:id`

### Removed
- Removed deprecated settings repository: `repositories/_x_settings.repo.js`
- Removed deprecated settings routes file: `routes/_x_settings.routes.js`

## [0.1.0] - 2026-02-11

### Changed
- Managers route/repository cleanup and auth-related cleanup.
- Refactored manager repository and routes to structured responses.
- Standardized public manager read endpoints.

## [0.0.7] - 2026-02-10

### Changed
- Introduced dynamic column mapping work for projects.
- Expanded project repository helpers and route coverage for project operations.

## [0.0.6] - 2026-02-10

### Changed
- Loaded environment variables in `db/db.js` before DB initialization.
- Fixed DB path resolution relative to module directory.

## [0.0.5]

### Changed
- Ongoing work on project services and project routes.

## [0.0.4]

### Changed
- Planning milestone.

## [0.0.3]

### Changed
- Completed managers services and admin routes related to managers.

## [0.0.2]

### Changed
- Started refactoring based on new logic.

## [0.0.1]

### Added
- First version after splitting backend/frontend codebases.
