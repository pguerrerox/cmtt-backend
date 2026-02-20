import express from 'express'
import cookieParser from 'cookie-parser'
import admins from './routes/admin.routes.js'
import projects from './routes/projects.routes.js'

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
