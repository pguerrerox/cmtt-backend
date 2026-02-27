import allowedFields from '../helpers/_ALLOWED_FACILITY_FIELDS.js'

function customerExists(db, customerId) {
    if (customerId === null || customerId === undefined || customerId === '') return false
    const row = db.prepare('SELECT id FROM customers WHERE id = ?').get(customerId)
    return !!row
}

export const createFacility = (db, data) => {
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

    if (!customerExists(db, data.customer_id)) {
        return { ok: false, error: 'customer not found' }
    }

    const columns = keys.join(', ')
    const placeholders = keys.map((key) => `:${key}`).join(', ')

    try {
        const stmt = db.prepare(`INSERT INTO facilities (${columns}) VALUES (${placeholders})`)
        stmt.run(data)
        return { ok: true, message: 'facility created' }
    } catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const updateFacility = (db, id, data) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'invalid payload' }

    const keys = Object.keys(data)
    if (keys.length === 0) return { ok: false, error: 'no data provided' }

    const droppedKeys = keys.filter((key) => !allowedFields.includes(key))
    if (droppedKeys.length > 0) {
        return { ok: false, error: `invalid fields: ${droppedKeys.join(', ')}`, droppedKeys }
    }

    if (data.customer_id !== undefined && !customerExists(db, data.customer_id)) {
        return { ok: false, error: 'customer not found' }
    }

    const setClause = keys.map((key) => `${key} = :${key}`).join(', ')

    try {
        const stmt = db.prepare(`UPDATE facilities SET ${setClause} WHERE id = :id`)
        const info = stmt.run({ ...data, id })
        return info.changes > 0 ? { ok: true, message: 'facility updated' } : { ok: false, error: 'facility not found' }
    } catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const deleteFacility = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const stmt = db.prepare('DELETE FROM facilities WHERE id = ?')
        const info = stmt.run(id)
        return info.changes > 0 ? { ok: true, message: 'facility deleted' } : { ok: false, error: 'facility not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getAllFacilities = (db) => {
    try {
        const data = db.prepare(`
            SELECT facilities.*, customers.name AS customer_name
            FROM facilities
            JOIN customers ON facilities.customer_id = customers.id
            ORDER BY facilities.name ASC
        `).all()
        return { ok: true, data }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getFacilityById = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const data = db.prepare(`
            SELECT facilities.*, customers.name AS customer_name
            FROM facilities
            JOIN customers ON facilities.customer_id = customers.id
            WHERE facilities.id = ?
        `).get(id)
        return data ? { ok: true, data } : { ok: false, error: 'facility not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
