# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-02-24

### Added
- Added an MVP login flow with a `/login` page that lists managers and simulates session selection.
- Added a manager landing page at `/manager` with role-based project visibility (all projects for `Team Leader`, assigned projects for other roles).
- Added a project details page at `/projects/:projectNumber` with milestone review and update support for actual dates and `status_notes`.
- Added frontend API helpers for `PATCH` and `DELETE` plus project/manager update endpoints used by the new admin and project flows.

### Changed
- Updated the Home page to a read-only portfolio table with the new columns: project description, kickoff actual date, and delivery planned date.
- Updated the app header with login/logout controls and manager-aware navigation.
- Updated the admin manager list UI to show right-aligned hover actions with gear/trash icon controls.

### Fixed
- Fixed admin manager form status messaging so create and edit actions report the correct success state immediately.

## [0.2.1] - 2026-02-22

### Added
- Added admin role radio options for manager creation: `Team Leader`, `Senior Project Manager`, `Project Manager`, and `Guest`.

### Changed
- Changed manager role input from free-text to single-select radio controls.
- Set `Project Manager` as the default role in the admin create-manager form.

## [0.2.0] - 2026-02-22

### Added
- Added a React + Vite frontend workspace scaffold with routing and shared app shell.
- Added Home page manager selector, project listing table, and create-project navigation.
- Added Admin page manager list and manager creation form wired to admin endpoints.
- Added Create Project page with manager-aware project submission flow and lookup status feedback.
- Added API client layer, endpoint modules, selected-manager context state, and date formatting helper.
- Added frontend environment example and Vite configuration for local development.

### Changed
- Replaced frontend placeholder scripts with real `dev`, `build`, and `preview` Vite commands.
- Updated frontend README with page coverage, API integration behavior, and local setup instructions.
