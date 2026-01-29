import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import initProjectsTable from './models/projects_Model.js'
import initManagersTable from './models/managers_Model.js'
import initSettingsTable from './models/settings_Model.js'

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

// Initial DB data
import { insertProjects } from './services/projects_Serv.js'
import dataReadyForSQLite from './helpers/excel_DataReadyForSQLite.js'
insertProjects(db, dataReadyForSQLite())

import dataActiveManagers from './helpers/data_active_managers.js'
// import { insertManagers } from './services/managers_Serv.js'
// insertManagers(db, dataActiveManagers)

export default db