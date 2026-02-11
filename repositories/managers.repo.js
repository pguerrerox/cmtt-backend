/**
 * MANAGERS DATABASE REPOSITORIES
 * 
 * Handles all CRUD operations for the 'managers' table.
 * Dependencies: better-sqlite3
 * 
 * Methods:
 * - createManager: Inserts a new Project Manager (checks for duplicates)
 * - updateManager: Modifies existing Project Manager data by ID
 * - deleteManager: Removes a Project Manager from the system by ID
 * - getAllManagers: Retrieves the full list of PMs
 * - getManagerByName: Retrieves one Project Manager by its Name
 * - getManagerById: Retreives one Project Manager by its ID
**/

export const createManager = (db, data) => {
    // Create in the database a new Project Manager
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO managers (name, fullname, email, role, isActive, isAdmin) VALUES (?,?,?,?,?,?)
    `)
    const info = stmt.run(
        data.name,
        data.fullname,
        data.email,
        data.role,
        data.isActive,
        data.isAdmin
    )
    return info.changes > 0
        ? { ok: true, message: 'manager created' }
        : { ok: false, error: 'manager already exists' };
}

export const updateManager = (db, id, data) => {
    // Modify an existing and selected Project Manager
    const stmt = db.prepare(`
        UPDATE managers 
        SET name = ?, 
            fullname = ?, 
            email = ?, 
            role = ?, 
            isActive = ?, 
            isAdmin = ? 
        WHERE id = ?
    `);
    const info = stmt.run(
        data.name,
        data.fullname,
        data.email,
        data.role,
        data.isActive,
        data.isAdmin,
        id // The ID for the WHERE clause
    );
    return info.changes > 0
        ? { ok: true, message: 'manager updated' }
        : { ok: false, error: 'manager not found' };
}

export const deleteManager = (db, id) => {
    // Delete an existing Project Manager
    const stmt = db.prepare(`
        DELETE FROM managers WHERE id = ?
    `);
    const info = stmt.run(id)
    return info.changes > 0
        ? { ok: true, message: 'manager deleted' }
        : { ok: false, error: 'manager not found' };
}

export const getAllManagers = (db) => {
    const managers = db.prepare(`SELECT * FROM managers ORDER BY fullname ASC`).all();
    return { ok: true, data: managers };
}

export const getManagerByName = (db, name) => {
    const manager = db.prepare(`SELECT * FROM managers WHERE name = ?`).get(name);
    return manager
        ? { ok: true, data: manager }
        : { ok: false, error: 'manager not found' };
}

export const getManagerById = (db, id) => {
    const manager = db.prepare(`SELECT * FROM managers WHERE id =?`).get(id);
    return manager
        ? { ok: true, data: manager }
        : { ok: false, error: 'manager not found' };
}
