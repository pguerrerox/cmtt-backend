/**
 * SQL schema for the `managers` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    fullname TEXT,
    email TEXT UNIQUE,
    role TEXT,
    isActive INTEGER,
    isAdmin INTEGER
)`
