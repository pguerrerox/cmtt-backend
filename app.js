import dotenv from 'dotenv'
import express from 'express'
import db from './db.js'

// Load environment variables
dotenv.config()

// Initialize Express aspp
const app = express()

// Middlewares
app.use(express.json())
app.use((req, res, next) => {
  req.db = db
  next()
})

// Declaring routes
import projects from './routes/project_Routes.js'
app.use('/api/projects', projects(db))


// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`)
  console.log(`\x1b[35m   ➜ \x1b[0m Server running Local:   \x1b[35mhttp://localhost:${PORT}/\x1b[0m`);
})