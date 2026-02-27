/**
 * SQL schema for the `salesmanagers` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS salesmanagers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    telephone TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
)`
