/**
 * SQL schema for the `facilities` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    customer_id INTEGER NOT NULL,
    address TEXT,
    contacts TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
)`
