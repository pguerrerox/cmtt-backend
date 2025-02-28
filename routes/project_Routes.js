import express from 'express'
import dataReadyForSQLite from '../helpers/excel_DataReadyForSQLite.js'
import {
    insertProjects,
    getAllProjects,
    getProjectByProjectNumber,
    getProjectsByProjectManager,
    getAllProjectManagers
} from '../services/projects.js'

const router = express.Router()

router.post('/update-database', (req, res) => {
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
router.get('/getAllProjects', (req, res) => {
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
router.get('/getProjectByProjectNumber/:project_number', (req, res) => {
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
router.get('/getProjectsByProjectManager/:project_manager', (req, res) => {
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
router.get('/projectmanagers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getAllProjectManagers(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error fetching projects: ${err}`);
        res.status(500).json({ error: err.message })
    }
})


export default (db) => {
    return router;
};