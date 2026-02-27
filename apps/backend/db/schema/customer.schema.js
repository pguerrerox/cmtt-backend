/**
 * SQL schema for the `customers` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT,
    salesmanager_id INTEGER NOT NULL,
    projecteng_id INTEGER NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (salesmanager_id) REFERENCES salesmanagers(id) ON DELETE SET NULL,
    FOREIGN KEY (projecteng_id) REFERENCES projecteng(id) ON DELETE SET NULL
)`
