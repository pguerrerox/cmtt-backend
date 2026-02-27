import allowedFields from '../helpers/_ALLOWED_CUSTOMER_FIELDS.js'

function hasValidForeignRow(db, table, id) {
    if (id === null || id === undefined || id === '') return true
    const row = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(id)
    return !!row
}

export const createCustomer = (db, data) => {
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

    if (!hasValidForeignRow(db, 'salesmanagers', data.salesmanager_id)) {
        return { ok: false, error: 'salesmanager not found' }
    }

    if (!hasValidForeignRow(db, 'projecteng', data.projecteng_id)) {
        return { ok: false, error: 'project engineer not found' }
    }

    const columns = keys.join(', ')
    const placeholders = keys.map((key) => `:${key}`).join(', ')

    try {
        const stmt = db.prepare(`INSERT INTO customers (${columns}) VALUES (${placeholders})`)
        stmt.run(data)
        return { ok: true, message: 'customer created' }
    } catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const updateCustomer = (db, id, data) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'invalid payload' }

    const keys = Object.keys(data)
    if (keys.length === 0) return { ok: false, error: 'no data provided' }

    const droppedKeys = keys.filter((key) => !allowedFields.includes(key))
    if (droppedKeys.length > 0) {
        return { ok: false, error: `invalid fields: ${droppedKeys.join(', ')}`, droppedKeys }
    }

    if (data.salesmanager_id !== undefined && !hasValidForeignRow(db, 'salesmanagers', data.salesmanager_id)) {
        return { ok: false, error: 'salesmanager not found' }
    }

    if (data.projecteng_id !== undefined && !hasValidForeignRow(db, 'projecteng', data.projecteng_id)) {
        return { ok: false, error: 'project engineer not found' }
    }

    const setClause = keys.map((key) => `${key} = :${key}`).join(', ')

    try {
        const stmt = db.prepare(`UPDATE customers SET ${setClause} WHERE id = :id`)
        const info = stmt.run({ ...data, id })
        return info.changes > 0 ? { ok: true, message: 'customer updated' } : { ok: false, error: 'customer not found' }
    } catch (err) {
        if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
            return { ok: false, error: `constraint error: ${err.message}` }
        }
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const deleteCustomer = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const stmt = db.prepare('DELETE FROM customers WHERE id = ?')
        const info = stmt.run(id)
        return info.changes > 0 ? { ok: true, message: 'customer deleted' } : { ok: false, error: 'customer not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getAllCustomers = (db) => {
    try {
        const data = db.prepare(`
            SELECT customers.*, salesmanagers.name AS salesmanager_name, projecteng.name AS projecteng_name
            FROM customers
            LEFT JOIN salesmanagers ON customers.salesmanager_id = salesmanagers.id
            LEFT JOIN projecteng ON customers.projecteng_id = projecteng.id
            ORDER BY customers.name ASC
        `).all()
        return { ok: true, data }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}

export const getCustomerById = (db, id) => {
    if (typeof id === 'string' && id.trim().length === 0) return { ok: false, error: 'id is required' }
    if (!id) return { ok: false, error: 'id is required' }

    try {
        const data = db.prepare(`
            SELECT customers.*, salesmanagers.name AS salesmanager_name, projecteng.name AS projecteng_name
            FROM customers
            LEFT JOIN salesmanagers ON customers.salesmanager_id = salesmanagers.id
            LEFT JOIN projecteng ON customers.projecteng_id = projecteng.id
            WHERE customers.id = ?
        `).get(id)
        return data ? { ok: true, data } : { ok: false, error: 'customer not found' }
    } catch (err) {
        return { ok: false, error: `database error: ${err.message}` }
    }
}
