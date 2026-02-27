import allowedFields from '../helpers/_ALLOWED_SALESMANAGER_FIELDS.js'

export const createSalesManager = (db, data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { ok: false, error: 'invalid payload' }
    }

    const keys = Object.keys(data)
    if (keys.length === 0) return { ok: false, error: 'no data provided' }

    const droppedKeys = keys.filter((key) => !allowedFields.includes(key))
    if (droppedKeys.length > 0) {
        return { ok: false, error: `invalid fields: ${droppedKeys.join(', ')}`, droppedKeys }
    }

    if (!data.name || (typeof data.name === 'string' && data.name.trim().length === 0)) {
        return { ok: false, error: 'name is required' }
    }

    const columns = keys.join(', ')
    const placeholders = keys.map((key) => `:${key}`).join(', ')

    try {
        const stmt = db.prepare(`INSERT INTO salesmanagers (${columns}) VALUES (${placeholders})`)
        stmt.run(data)
        return { ok: true, message: 'sales manager created' }
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { ok: false, error: 'sales manager already exists' }
        }
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const updateSalesManager = (db, id, data) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'invalid payload' }

    const keys = Object.keys(data)
    if (keys.length === 0) return { ok: false, error: 'no data provided' }

    const droppedKeys = keys.filter((key) => !allowedFields.includes(key))
    if (droppedKeys.length > 0) {
        return { ok: false, error: `invalid fields: ${droppedKeys.join(', ')}`, droppedKeys }
    }

    const setClause = keys.map((key) => `${key} = :${key}`).join(', ')

    try {
        const stmt = db.prepare(`UPDATE salesmanagers SET ${setClause} WHERE id = :id`)
        const info = stmt.run({ ...data, id })
        return info.changes > 0 ? { ok: true, message: 'sales manager updated' } : { ok: false, error: 'sales manager not found' }
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { ok: false, error: 'sales manager already exists' }
        }
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const deleteSalesManager = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const stmt = db.prepare('DELETE FROM salesmanagers WHERE id = ?')
        const info = stmt.run(id)
        return info.changes > 0 ? { ok: true, message: 'sales manager deleted' } : { ok: false, error: 'sales manager not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getAllSalesManagers = (db) => {
    try {
        const data = db.prepare('SELECT * FROM salesmanagers ORDER BY name ASC').all()
        return { ok: true, data }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getSalesManagerById = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const data = db.prepare('SELECT * FROM salesmanagers WHERE id = ?').get(id)
        return data ? { ok: true, data } : { ok: false, error: 'sales manager not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
