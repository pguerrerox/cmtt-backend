import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import db from './db.js'

// Load environment variables
dotenv.config()

// Initialize Express aspp
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
// {
  // origin: ['http://localhost:5173', 'http://10.0.32.*:5173'],
  // credentials: true
// }
app.use(cookieParser())
app.use((req, res, next) => {
  req.db = db
  next()
})

// Declaring routes
import projects from './routes/projects_Routes.js'
import managers from './routes/managers_Routes.js'
import settings from './routes/settings_Routes.js'
app.use('/api', projects(db), managers(db), settings(db))

import auth_Routes from './routes/auth_Routes.js'
app.use('/auth', auth_Routes)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`)
  console.log(`\x1b[35m   ➜ \x1b[0m Server running Local:   \x1b[35mhttp://localhost:${PORT}/\x1b[0m`);
})