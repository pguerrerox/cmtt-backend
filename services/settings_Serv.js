export const saveStore = (db, user, store_name, store_state) => {
    const stmt = db.prepare(`
        INSERT INTO states (user, store_name, store_state)
        VALUES (?, ?, ?)
        ON CONFLICT(user, store_name) 
        DO UPDATE SET store_state = excluded.store_state`)
    stmt.run(user, store_name, store_state)
}
export const loadStore = (db) => {
    return db.prepare(`SELECT store_state FROM stores WHERE store_name = ?`)
}