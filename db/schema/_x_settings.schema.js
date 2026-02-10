const initSettingsTable = `
CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    store_name TEXT NOT NULL,
    store_state TEXT NOT NULL,
    UNIQUE (user, store_name)
)`

export default initSettingsTable