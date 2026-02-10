import express from 'express'
import cookieParser from 'cookie-parser'
import db from './db/db.js'

// Initialize Express app
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  req.db = db
  next()
})

// Declaring routes
import admins from './routes/admin.routes.js'
import projects from './routes/projects.routes.js'
app.use('/api', admins, projects)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`)
  console.log(`\x1b[35m   ➜ \x1b[0m Server running Local:   \x1b[35mhttp://localhost:${PORT}/\x1b[0m`);
})