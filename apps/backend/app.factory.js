import express from 'express'
import cookieParser from 'cookie-parser'
import admins from './routes/admin.routes.js'
import projects from './routes/projects.routes.js'

/**
 * Creates and configures the Express application instance.
 *
 * Attaches JSON and cookie parsing middleware, injects the shared database
 * connection into each request as `req.db`, and mounts API routes under `/api`.
 *
 * @param {import('better-sqlite3').Database} db - Shared SQLite database connection.
 * @returns {import('express').Express} Configured Express application.
 */
export default function createApp(db) {
    const app = express()

    app.use(express.json())
    app.use(cookieParser())
    app.use((req, res, next) => {
        req.db = db
        next()
    })

    app.use('/api', admins, projects)

    return app
}
