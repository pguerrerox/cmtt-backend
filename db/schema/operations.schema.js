import operationsFields from '../../helpers/_OPERATIONS_FIELDS.js'

const operationsColumns = operationsFields
    .map((field) => `    ${field} INTEGER`)
    .join(',\n')

export default `
CREATE TABLE IF NOT EXISTS operations_planned_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_number TEXT UNIQUE NOT NULL,
${operationsColumns},
    source_version TEXT,
    refreshed_at INTEGER NOT NULL
)`
