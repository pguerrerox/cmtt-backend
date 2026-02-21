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

export const getDueQueueItems = (db, now = Date.now(), limit = 50) => {
    const safeNow = toIntegerDate(now)
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 50

    if (safeNow === null) {
        return { ok: false, error: 'invalid now timestamp' }
    }

    try {
        const projects = db.prepare(`
            SELECT * FROM projects_lookup_queue
            WHERE status = 'pending'
              AND (next_attempt_date IS NULL OR next_attempt_date <= ?)
            ORDER BY next_attempt_date IS NULL, next_attempt_date ASC, created_at ASC
            LIMIT ?;
        `).all(safeNow, safeLimit)

        return { ok: true, data: projects }
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const updateQueueEntry = (db, project_number, updates = {}) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        return { ok: false, error: 'invalid payload' }
    }

    const clauses = []
    const payload = { project_number }

    if (updates.status !== undefined) {
        if (!allowedStatuses.includes(updates.status)) {
            return { ok: false, error: 'invalid status' }
        }
        clauses.push('status = :status')
        payload.status = updates.status
    }

    if (updates.attempts !== undefined) {
        if (!Number.isInteger(updates.attempts) || updates.attempts < 0) {
            return { ok: false, error: 'invalid attempts' }
        }
        clauses.push('attempts = :attempts')
        payload.attempts = updates.attempts
    }

    if (updates.last_attempt_date !== undefined) {
        const lastAttemptDate = toIntegerDate(updates.last_attempt_date)
        clauses.push('last_attempt_date = :last_attempt_date')
        payload.last_attempt_date = lastAttemptDate
    }

    if (updates.next_attempt_date !== undefined) {
        const nextAttemptDate = toIntegerDate(updates.next_attempt_date)
        clauses.push('next_attempt_date = :next_attempt_date')
        payload.next_attempt_date = nextAttemptDate
    }

    if (clauses.length === 0) {
        return { ok: false, error: 'no data provided' }
    }

    payload.updated_at = Date.now()
    clauses.push('updated_at = :updated_at')

    const sql = `
        UPDATE projects_lookup_queue
        SET ${clauses.join(', ')}
        WHERE project_number = :project_number;
    `

    try {
        const info = db.prepare(sql).run(payload)
        return info.changes > 0
            ? { ok: true, message: 'queue entry updated' }
            : { ok: false, error: 'project not found in queue' }
    }
    catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const removeFromQueue = (db, project_number) => {
    if (typeof project_number === 'string' && project_number.trim().length === 0) {
        return { ok: false, error: 'project_number is required' }
    }
    if (!project_number) {
        return { ok: false, error: 'project_number is required' }
    }

    try {
        const info = db.prepare(`
            DELETE FROM projects_lookup_queue WHERE project_number = ?;
        `).run(project_number)

        return info.changes > 0
            ? { ok: true, message: 'queue entry removed' }
            : { ok: false, error: 'project not found in queue' }
    }
    catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
