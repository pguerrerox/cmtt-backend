import Database from 'better-sqlite3'
import managerSchema from '../../db/schema/manager.schema.js'
import projectSchema from '../../db/schema/project.schema.js'
import operationsSchema from '../../db/schema/operations.schema.js'
import projectsLookupSchema from '../../db/schema/projectsLookup.schema.js'

export function createTestDb() {
    const db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    db.prepare(managerSchema).run()
    db.prepare(projectSchema).run()
    db.prepare(operationsSchema).run()
    db.prepare(projectsLookupSchema).run()
    return db
}
