import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import managerSchema from './schema/manager.schema.js'
import projectSchema from './schema/project.schema.js'

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

export default db

// db.prepare(initSettingsTable).run()
// console.log('DB-> State table initialized')

// Initial DB data
// import { insertProjects } from './services/projects_Serv.js'
// import dataReadyForSQLite from './helpers/excel_DataReadyForSQLite.js'
// insertProjects(db, dataReadyForSQLite())

// import dataActiveManagers from './helpers/data_active_managers.js'
// import { insertManagers } from './services/managers_Serv.js'
// insertManagers(db, dataActiveManagers)
