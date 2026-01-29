const initManagersTable = `
CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    fullname TEXT,
    email TEXT UNIQUE,
    role TEXT,
    isActive INTEGER,
    isAdmin INTEGER
)`

export default initManagersTable