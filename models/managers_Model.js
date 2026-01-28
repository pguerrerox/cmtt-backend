const initManagersTable = `
CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    fullname TEXT UNIQUE,
    email TEXT UNIQUE,
    role TEXT,
    isActive INTEGER,
    isAdmin INTEGER
)`

export default initManagersTable