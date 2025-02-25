import db from "../schemas/storesSchema.js"

const saveStore = db.prepare(`
    INSERT INTO stores ( store_name, store_state )
    VALUES (?, ?)
    ON CONFLICT (store_name) DO UPDATE SET store_state = excluded.store_state;
`)

const loadStore = db.prepare(`
    SELECT store_state FROM stores WHERE store_name = ?;
`)


export {
    saveStore,
    loadStore,
}