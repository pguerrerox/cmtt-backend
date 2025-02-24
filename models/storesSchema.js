import Database from "better-sqlite3";

// create or connect to database
const db = new Database(`src\\database\\main.db`)

const initStatesTable = `
CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT UNIQUE NOT NULL,
    store_state TEXT NOT NULL
)`

db.prepare(initStatesTable).run()
console.log("Store Stare Database is ready!");

export default db