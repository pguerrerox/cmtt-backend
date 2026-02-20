const allowedStatuses = ['pending', 'resolved', 'failed']

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

export const enqueueProject = (db, project_number, options = {}) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' }
    }

    const status = options.status ?? 'pending'
    if (!allowedStatuses.includes(status)) {
        return { ok: false, error: 'invalid status' }
    }

    const now = Date.now()
    const nextAttemptDate = toIntegerDate(options.next_attempt_date)
    const lastAttemptDate = toIntegerDate(options.last_attempt_date)

    const sql = `
        INSERT INTO projects_lookup_queue (
            project_number,
            status,
            attempts,
            last_attempt_date,
            next_attempt_date,
            created_at,
            updated_at
        )
        VALUES (
            :project_number,
            :status,
            0,
            :last_attempt_date,
            :next_attempt_date,
            :created_at,
            :updated_at
        )
        ON CONFLICT(project_number) DO UPDATE SET
            status = excluded.status,
            next_attempt_date = COALESCE(excluded.next_attempt_date, projects_lookup_queue.next_attempt_date),
            updated_at = excluded.updated_at;
    `

    try {
        db.prepare(sql).run({
            project_number,
            status,
            last_attempt_date: lastAttemptDate,
            next_attempt_date: nextAttemptDate,
            created_at: now,
            updated_at: now
        })
        return { ok: true, message: 'project queued' }
    }
    catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getProjectByNumber = (db, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' }
    }

    try {
        const project = db.prepare(`
            SELECT * FROM projects_lookup_queue WHERE project_number = ?;
        `).get(project_number)

        return project
            ? { ok: true, data: project }
            : { ok: false, error: 'project not found in queue' }
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getAllQueue = (db) => {
    try {
        const projects = db.prepare(`
            SELECT * FROM projects_lookup_queue
            ORDER BY next_attempt_date IS NULL, next_attempt_date ASC, created_at ASC;
        `).all()
        return { ok: true, data: projects }
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
