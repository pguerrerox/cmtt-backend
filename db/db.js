import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import managerSchema from './schema/manager.schema.js'
import projectSchema from './schema/project.schema.js'
import operationsSchema from './schema/operations.schema.js'
import projectsLookupSchema from './schema/projectsLookup.schema.js'

// Load environment variables early for DB_PATH
dotenv.config()

// Prepare filepath for Database
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.resolve(__dirname, process.env.DB_PATH ?? '/databases/dev_main.db')
console.log(`\nDB-> Path: ${dbPath}`)

// Create database if it doesn't exist
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

export default db
