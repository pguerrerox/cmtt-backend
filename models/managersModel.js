const initManagersTable = `
CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_manager TEXT UNIQUE,
    isActive TEXT
)`

export default initManagersTable