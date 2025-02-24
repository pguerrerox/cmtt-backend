import dotenv from 'dotenv';
import express from 'express';
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import initProjectsTable from './models/projectsSchema.js';

// Load environment variables
dotenv.config();

// Initialize Express aspp
const app = express(); 


// Initialize SQLite database using better-sqlite3
const dbPath = path.join(fileURLToPath(import.meta.url), process.env.DB_PATH || '../databases/dev_main.db');
console.log(`\nDB Path: ${dbPath}`);
const db = new Database(dbPath)
console.log(`Database connected`);
db.prepare(initProjectsTable).run()
console.log('Database initialized');


// Middlewares
app.use(express.json());


// Defining routes
import projects from './routes/project_Routes.js'
app.use('/api/projects', projects(db));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});