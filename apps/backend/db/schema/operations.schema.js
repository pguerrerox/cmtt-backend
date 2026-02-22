import operationsFields from '../../helpers/_OPERATIONS_FIELDS.js'

/**
 * Generated SQL column list for operations planned date fields.
 *
 * @type {string}
 */
const operationsColumns = operationsFields
    .map((field) => `    ${field} INTEGER`)
    .join(',\n')

/**
 * SQL schema for the `operations_planned_dates` table.
 *
 * @type {string}
 */
export default `
CREATE TABLE IF NOT EXISTS operations_planned_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_number TEXT UNIQUE NOT NULL,
${operationsColumns},
    source_version TEXT,
    refreshed_at INTEGER NOT NULL
)`
