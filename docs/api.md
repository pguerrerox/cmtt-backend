# API

Base path: `/api`

## Managers (Admin)
- `POST /admin/createManager`
- `PATCH /admin/updateManager/:id`
- `DELETE /admin/deleteManager/:id`
- `GET /admin/managers`
- `GET /admin/manager/name/:name`
- `GET /admin/manager/id/:id`

## Managers (Read Only)
- `GET /managers`
- `GET /manager/name/:name`
- `GET /manager/id/:id`

## Projects
- `POST /createProject`
- `PATCH /modifyProject/:project_number`
- `DELETE /deleteProject/:project_number`
- `GET /projects`
- `GET /projects/manager/:manager_id`
- `GET /projects/customer/:customer_name`
- `GET /projects/:project_number`

## Notes
- Typical response codes: `200`, `201`, `400`, `404`, `409`, `500`.
- `createProject` returns `lookup_status` indicating immediate enrichment or queueing.
- Read-only manager routes are implemented in `apps/backend/routes/managers.routes.js`.
- Auth and API versioning strategy should be defined before production rollout.
