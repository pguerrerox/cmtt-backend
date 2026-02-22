import allowed_fields from '../helpers/_ALLOWED_PROJECT_FIELDS.js'
import operationsFields from '../helpers/_OPERATIONS_FIELDS.js'
import { getOperationsPlanByProjectNumber } from './operations.repo.js'
import { enqueueProject } from './projectsLookup.repo.js'

/**
 * Projects repository.
 *
 * Provides CRUD and query operations for the `projects` table and coordinates
 * operations-plan enrichment and queueing during project creation.
 */

/**
 * Inserts a project and resolves lookup status in a single transaction.
 *
 * If operations data exists for the project number, operations date fields are
 * copied into the new project row. If not, the project number is queued for
 * asynchronous lookup.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {Record<string, unknown>} data - Project payload with allowed fields.
 * @returns {{ ok: boolean, message?: string, lookup_status?: 'enriched'|'queued', error?: string, droppedKeys?: string[] }} Operation result.
 */
export const createProject = (db, data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { ok: false, error: 'invalid payload' };
    }

    const keys = Object.keys(data);
    if (keys.length === 0) return { ok: false, error: 'no data provided' };

    const droppedKeys = keys.filter((key) => !allowed_fields.includes(key));
    if (droppedKeys.length > 0) {
        return {
            ok: false,
            error: `invalid fields: ${droppedKeys.join(', ')}`,
            droppedKeys
        };
    }

    const hasProjectNumber = typeof data.project_number === 'string'
        ? data.project_number.trim().length > 0
        : !!data.project_number;
    if (!hasProjectNumber) {
        return { ok: false, error: 'project_number is required' };
    }

    const columns = keys.join(', ');
    const placeholders = keys.map((key) => `:${key}`).join(', ');
    const sqlStatement = `INSERT INTO projects (${columns}) VALUES (${placeholders})`;

    try {
        const insertProject = db.prepare(sqlStatement)
        const updateProjectOperations = db.prepare(`
            UPDATE projects
            SET ${operationsFields.map((field) => `${field} = :${field}`).join(', ')}
            WHERE project_number = :project_number
        `)

        const tx = db.transaction((payload) => {
            insertProject.run(payload)

            const operationsResult = getOperationsPlanByProjectNumber(db, payload.project_number)
            if (operationsResult.ok) {
                const operationsPayload = operationsFields.reduce((acc, field) => {
                    acc[field] = operationsResult.data[field] ?? null
                    return acc
                }, { project_number: payload.project_number })

                updateProjectOperations.run(operationsPayload)
                return { ok: true, message: 'project inserted', lookup_status: 'enriched' }
            }

            if (operationsResult.error === 'operations plan not found') {
                const queueResult = enqueueProject(db, payload.project_number, { status: 'pending' })
                if (!queueResult.ok) {
                    throw new Error(queueResult.error)
                }
                return { ok: true, message: 'project inserted', lookup_status: 'queued' }
            }

            throw new Error(operationsResult.error)
        })

        return tx(data)
    }
    catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { ok: false, error: 'project already exists' };
        }

        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` };
        }

        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Updates a project by project number.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {Record<string, unknown>} data - Partial project payload.
 * @param {string} project_number - Project identifier.
 * @returns {{ ok: boolean, message?: string, error?: string, droppedKeys?: string[] }} Operation result.
 */
export const modifyProject = (db, data, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' };
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' };
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { ok: false, error: 'invalid payload' };
    }

    const keys = Object.keys(data);
    if (keys.length === 0) return { ok: false, error: 'no data provided' };

    const droppedKeys = keys.filter((key) => !allowed_fields.includes(key));
    if (droppedKeys.length > 0) {
        return {
            ok: false,
            error: `invalid fields: ${droppedKeys.join(', ')}`,
            droppedKeys
        };
    }

    if (keys.includes('project_number')) {
        return { ok: false, error: 'project_number cannot be updated' };
    }

    const stringStatement = keys.map((key) => `${key} = :${key}`).join(', ');

    try {
        const stmt = db.prepare(`UPDATE projects SET ${stringStatement} WHERE project_number = :project_number`);
        const info = stmt.run({ ...data, project_number });
        return info.changes > 0
            ? { ok: true, message: 'project updated' }
            : { ok: false, error: 'project not found' };
    }
    catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { ok: false, error: 'project already exists' };
        }

        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` };
        }

        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Deletes a project by project number.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {string} project_number - Project identifier.
 * @returns {{ ok: boolean, message?: string, error?: string }} Operation result.
 */
export const deleteProject = (db, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' };
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' };
    }

    try {
        const stmt = db.prepare(`DELETE FROM projects WHERE project_number = ?`);
        const info = stmt.run(project_number);
        return info.changes > 0
            ? { ok: true, message: 'project deleted' }
            : { ok: false, error: 'project not found' };
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Returns all projects with related manager name when available.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @returns {{ ok: boolean, data?: unknown[], error?: string }} Query result.
 */
export const getAllProjects = (db) => {
    try {
        const sql = `
            SELECT projects.*, managers.name AS manager_name
            FROM projects 
            LEFT JOIN managers ON projects.manager_id = managers.id;
        `;

        const stmt = db.prepare(sql);
        const projects = stmt.all();
        return { ok: true, data: projects };
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Returns one project by project number.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {string} project_number - Project identifier.
 * @returns {{ ok: boolean, data?: unknown, error?: string }} Query result.
 */
export const getProjectsByNumber = (db, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' };
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' };
    }

    try {
        const sql = `
            SELECT projects.*, managers.name AS manager_name
            FROM projects
            LEFT JOIN managers ON projects.manager_id = managers.id
            WHERE projects.project_number = ?;
        `;
        const stmt = db.prepare(sql);
        const project = stmt.get(project_number);
        return project
            ? { ok: true, data: project }
            : { ok: false, error: 'project not found' };
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Returns projects assigned to a manager id.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {number|string} manager_id - Manager identifier.
 * @returns {{ ok: boolean, data?: unknown[], error?: string }} Query result.
 */
export const getProjectsByManager = (db, manager_id) => {
    if (typeof manager_id === 'string' && manager_id.trim().length === 0) {
        return { ok: false, error: 'manager_id is required' };
    }
    if (!manager_id) {
        return { ok: false, error: 'manager_id is required' };
    }

    try {
        const sql = `
            SELECT projects.*, managers.name AS manager_name
            FROM projects
            LEFT JOIN managers ON projects.manager_id = managers.id
            WHERE projects.manager_id = ?;
        `;
        const stmt = db.prepare(sql);
        const projects = stmt.all(manager_id);
        return { ok: true, data: projects };
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` };
    }
}

/**
 * Returns projects for a customer name.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite connection.
 * @param {string} customer_name - Customer name filter.
 * @returns {{ ok: boolean, data?: unknown[], error?: string }} Query result.
 */
export const getProjectsByCustomer = (db, customer_name) => {
    if (typeof customer_name === 'string' && customer_name.trim().length === 0) {
        return { ok: false, error: 'customer_name is required' };
    }
    if (!customer_name) {
        return { ok: false, error: 'customer_name is required' };
    }

    try {
        const sql = `
            SELECT projects.*, managers.name AS manager_name
            FROM projects
            LEFT JOIN managers ON projects.manager_id = managers.id
            WHERE projects.customer_name = ?;
        `;
        const stmt = db.prepare(sql);
        const projects = stmt.all(customer_name);
        return { ok: true, data: projects };
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` };
    }
}
