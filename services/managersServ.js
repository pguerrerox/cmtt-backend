export const insertAllManagers = (db) => { // query all managers without duplicates from projects table, add a new {key:value} to each one, and insert them into the managers table, return the number of newly inserted managers
    const data = db.prepare(`SELECT DISTINCT project_manager FROM projects;`).all()
    const stmt = db.prepare(`INSERT OR IGNORE INTO managers ( project_manager, isActive) VALUES (?, ?)`)

    let inserted = 0
    data.forEach(manager => {
        const result = stmt.run(
            manager.project_manager,
            manager.isActive ?? 0
        )
        inserted += result.changes
    })
    return inserted
}
export const getAllManagers = (db) => { // return all managers on the database
    return db.prepare(`SELECT project_manager, isActive FROM managers`).all()
}
export const updateAllManagers = (db, isActive, project_manager) => {
    return db.prepare(`UPDATE managers SET isActive = ? WHERE project_manager = ?`).all(isActive, project_manager)
}
export const getActiveManagers = (db) => {
    return db.prepate(`SELECT * FROM managers WHERE isActive=true`).all()
}

