// need these operations
// 1- create pm
// 2- modify pm
// 3- delete pm
// 4- read all pms

export const createManager = (db, data) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO managers (name, fullname, email, role, isActive, isAdmin) VALUES (?,?,?,?,?,?)`)

    stmt.run(
        data.name,
        data.fullname,
        data.email,
        data.role,
        data.isActive,
        data.isAdmin
    )
    return 'OP: completed'
}


export const insertManagers = (db, data) => { // query all managers without duplicates from projects table, add a new {key:value} to each one, and insert them into the managers table, return the number of newly inserted managers
    // const data = db.prepare(`SELECT DISTINCT project_manager FROM projects;`).all()
    const stmt = db.prepare(`INSERT OR IGNORE INTO managers ( name, fullname, email, role,  isActive) VALUES (?,?,?,?,?)`)

    let counter = 0
    data.forEach(e => {
        const result = stmt.run(
            e.name,
            e.fullname,
            e.email,
            e.role,
            e.isActive
        )
        counter += result.changes
    })
    console.log(`Project Managers inserted/updated: ${counter}`);
    return counter
}
export const getManagers = (db) => { // return all managers on the database
    return db.prepare(`SELECT * FROM managers`).all()
}
export const updateManagers = (db, isActive, project_manager) => {
    return db.prepare(`UPDATE managers SET isActive = ? WHERE project_manager = ?`).all(isActive, project_manager)
}