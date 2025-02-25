const initStoresTable = `
CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT UNIQUE NOT NULL,
    store_state TEXT NOT NULL
)`

export default initStoresTable