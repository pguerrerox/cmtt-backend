import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import managerSchema from './schema/manager.schema.js'
import projectSchema from './schema/project.schema.js'
import operationsSchema from './schema/operations.schema.js'
import projectsLookupSchema from './schema/projectsLookup.schema.js'
import salesmanagerSchema from './schema/salesmanager.schema.js'
import projectEngSchema from './schema/projecteng.schema.js'
import customerSchema from './schema/customer.schema.js'
import facilitySchema from './schema/facility.schema.js'

/**
 * Database bootstrap module.
 *
 * Loads environment configuration, opens the SQLite database connection,
 * enables foreign keys, and initializes required tables.
 */

// Load environment variables early for DB_PATH
dotenv.config()

// Prepare filepath for Database
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Absolute filesystem path to the SQLite database file.
 *
 * Uses `DB_PATH` when provided, resolved relative to this module.
 * @type {string}
 */
const dbPath = path.resolve(__dirname, process.env.DB_PATH ?? '/databases/dev_main.db')
console.log(`\nDB-> Path: ${dbPath}`)

// Create database if it doesn't exist
/**
 * Shared SQLite database connection used by the application.
 *
 * @type {import('better-sqlite3').Database}
 */
const db = new Database(dbPath)
console.log(`DB-> Database is connected`)

// Support for foraign keys - ON
db.pragma('foreign_keys = ON');

// Initialize SQLite tables using better-sqlite3
db.prepare(managerSchema).run()
console.log('DB-> Managers table initialized')

db.prepare(projectSchema).run()
console.log('DB-> Projects table initialized')

db.prepare(operationsSchema).run()
console.log('DB-> Operations planned dates table initialized')

db.prepare(projectsLookupSchema).run()
console.log('DB-> Projects lookup queue table initialized')

db.prepare(salesmanagerSchema).run()
console.log('DB-> Sales managers table initialized')

db.prepare(projectEngSchema).run()
console.log('DB-> Project engineers table initialized')

db.prepare(customerSchema).run()
console.log('DB-> Customers table initialized')

db.prepare(facilitySchema).run()
console.log('DB-> Facilities table initialized')

export default db
