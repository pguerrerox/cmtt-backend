/**
 * MANAGERS DATABASE SERVICES
 * 
 * Handles all CRUD operations for the 'managers' table.
 * Dependencies: better-sqlite3
 * 
 * Methods:
 * - createManager: Inserts a new Project Manager (checks for duplicates)
 * - updateManager: Modifies existing Project Manager data by ID
 * - deleteManager: Removes a Project Manager from the system by ID
 * - getAllManagers: Retrieves the full list of PMs
 */

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
    return info.changes > 0 ? 'OP: completed' : 'Error: Manager already exist';
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
    return info.changes > 0 ? 'OP: updated' : 'Error: Manager not found';
}

export const deleteManager = (db, id) => {
    // Delete an existing Project Manager
    const stmt = db.prepare(`
        DELETE FROM managers WHERE id = ?
    `);
    const info = stmt.run(id)
    return info.changes > 0 ? 'OP: deleted' : 'Error: Manager not found';
}

export const getAllManagers = (db) => {
    return db.prepare(`SELECT * FROM managers ORDER BY fullname ASC`).all();
}

// export const insertManagers = (db, data) => { // query all managers without duplicates from projects table, add a new {key:value} to each one, and insert them into the managers table, return the number of newly inserted managers
//     // const data = db.prepare(`SELECT DISTINCT project_manager FROM projects;`).all()
//     const stmt = db.prepare(`INSERT OR IGNORE INTO managers ( name, fullname, email, role,  isActive) VALUES (?,?,?,?,?)`)

//     let counter = 0
//     data.forEach(e => {
//         const result = stmt.run(
//             e.name,
//             e.fullname,
//             e.email,
//             e.role,
//             e.isActive
//         )
//         counter += result.changes
//     })
//     console.log(`Project Managers inserted/updated: ${counter}`);
//     return counter
// }

// export const updateManagers = (db, isActive, project_manager) => {
//     return db.prepare(`UPDATE managers SET isActive = ? WHERE project_manager = ?`).all(isActive, project_manager)
// }