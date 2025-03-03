const getAllProjectManagers = (db) => { // return all project managers without duplicates 
    // check if the table exist first.
    return db.prepare(`SELECT DISTINCT project_manager FROM projects;`).all()
}

export const insertManagers = (db) => {
    const data = getAllProjectManagers(db)

    const stmt = db.prepare(`INSERT OR IGNORE INTO managers ( project_manager, isActive) VALUES (?, ?)`)

    let inserted = 0
    for (const manager of data) {
        const result = stmt.run(
            manager.project_manager,
            manager.isActive ?? 'false'
        )
        inserted += result.changes
    }
    return inserted
}

export const getManagers = (db) => {
    return db.prepare(`SELECT * FROM managers`).all()
}

export const getActiveManagers = (db) => {
    return db.prepate(`SELECT * FROM managers WHERE isActive=true`).all()
}

