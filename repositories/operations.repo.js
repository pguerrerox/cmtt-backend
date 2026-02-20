import operationsFields from '../helpers/_OPERATIONS_FIELDS.js'

const allowedFields = ['project_number', ...operationsFields, 'source_version', 'refreshed_at']
const integerDateFields = new Set([...operationsFields, 'refreshed_at'])

const toIntegerDate = (value) => {
    if (value === null || value === undefined || value === '') return null
    if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return null
        const numeric = Number(trimmed)
        if (Number.isFinite(numeric)) return Math.trunc(numeric)
    }
    return null
}

export const upsert = (db, data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { ok: false, error: 'invalid payload' }
    }

    const keys = Object.keys(data)
    if (keys.length === 0) return { ok: false, error: 'no data provided' }

    const droppedKeys = keys.filter((key) => !allowedFields.includes(key))
    if (droppedKeys.length > 0) {
        return {
            ok: false,
            error: `invalid fields: ${droppedKeys.join(', ')}`,
            droppedKeys
        }
    }

    const hasProjectNumber = typeof data.project_number === 'string'
        ? data.project_number.trim().length > 0
        : !!data.project_number
    if (!hasProjectNumber) {
        return { ok: false, error: 'project_number is required' }
    }

    const payload = {
        ...data,
        refreshed_at: data.refreshed_at ?? Date.now()
    }

    for (const key of Object.keys(payload)) {
        if (integerDateFields.has(key)) {
            payload[key] = toIntegerDate(payload[key])
        }
    }

    if (payload.refreshed_at === null) {
        payload.refreshed_at = Date.now()
    }

    const columns = Object.keys(payload)
    const placeholders = columns.map((key) => `:${key}`).join(', ')
    const updateClause = columns
        .filter((key) => key !== 'project_number')
        .map((key) => `${key} = excluded.${key}`)
        .join(', ')

    const sql = `
        INSERT INTO operations_planned_dates (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT(project_number) DO UPDATE SET ${updateClause};
    `

    try {
        db.prepare(sql).run(payload)
        return { ok: true, message: 'operations plan upserted' }
    }
    catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }

        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getOperationsPlanByProjectNumber = (db, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' }
    }

    try {
        const operation = db.prepare(`
            SELECT * FROM operations_planned_dates WHERE project_number = ?;
        `).get(project_number)

        return operation
            ? { ok: true, data: operation }
            : { ok: false, error: 'operations plan not found' }
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
