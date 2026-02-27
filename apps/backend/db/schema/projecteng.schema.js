/**
 * SQL schema for the `projecteng` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS projecteng (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    ext TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
)`
