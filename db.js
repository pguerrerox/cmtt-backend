import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import initProjectsTable from './models/projectsModel.js'
import initManagersTable from './models/managersModel.js'
import initSettingsTable from './models/settingsModel.js'


// Prepare filepath for Database
const dbPath = path.join(fileURLToPath(import.meta.url), process.env.DB_PATH || '../databases/dev_main.db')
console.log(`\nDB-> Path: ${dbPath}`)

// Create database if it doesn't exist
const db = new Database(dbPath)
console.log(`DB-> Database is connected`)

// Initialize SQLite tables using better-sqlite3
db.prepare(initProjectsTable).run()
console.log('DB-> Projects table initialized')

db.prepare(initManagersTable).run()
console.log('DB-> Managers table initialized')

db.prepare(initSettingsTable).run()
console.log('DB-> State table initialized')

export default db