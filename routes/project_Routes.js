import express from 'express'
import { verifyToken } from '../auth.js'
import dataReadyForSQLite from '../helpers/excel_DataReadyForSQLite.js'
import {
    insertProjects,
    getAllProjects,
    getProjectByProjectNumber,
    getProjectsByProjectManager,
    // getAllProjectManagers
} from '../services/projects.js'

const router = express.Router()

// ###############
// AUTH NOT REQUIRED
router.get('/projects', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getAllProjects(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error fetching projects: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

// ###############
// AUTH REQUIRED
router.post('/update-projects', verifyToken, (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const data = dataReadyForSQLite()
        const insertedRows = insertProjects(req.db, data)
        res.json({ message: `Inserted ${insertedRows} projects` })
    }
    catch (err) {
        console.error('Error at POST-"/update-database": ', err)
        res.status(500).json({ error: err.message })
    }
})
router.get('/search-project/:project_number', verifyToken, (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        if (/^\d{6}$/.test(req.params.project_number)) {
            res.json(getProjectByProjectNumber(req.db, req.params.project_number))
        } else {
            const err = new Error(`Project Number "${req.params.project_number}" is not valid`);
            console.error(`Error: ${err}`)
            res.status(500).json({ error: err.message })
        }
    }
    catch (err) {
        console.error(`Error fetching project: ${err}`);
        res.status(500).json({ error: err.message })
    }
})
router.get('/projects/:project_manager', verifyToken, (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const project_manager = req.params.project_manager.toUpperCase()
        if (/^[a-zA-Z]+$/.test(project_manager)) {
            res.json(getProjectsByProjectManager(req.db, project_manager))
        } else {
            const err = new Error(`Project Manager "${req.params.project_manager}" is not valid`);
            console.error(`Error: ${err}`)
            res.status(500).json({ error: err.message })
        }
    }
    catch (err) {
        console.error(`Error fetching projects: ${err}`);
        res.status(500).json({ error: err.message })
    }
})



export default (db) => {
    return router;
};