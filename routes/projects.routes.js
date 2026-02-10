import express from 'express'
import {
    createProject,
    modifyProject,
    deleteProject,
    getAllProjects,
    // getProjectByProjectNumber,
    // getProjectsByProjectManager,
} from '../services/projects_Serv.js'

const router = express.Router()

// POST
router.post('/createProject', (req, res) => {
    try {
        const result = createProject(req.db, req.body)
        if (result.startsWith('Error')) {
            return res.status(409).json({ error: result })
        }
        res.status(201).json({
            message: `Project ${req.body.project_number} was created successfully`,
            status: result
        })
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// PATCH
router.patch('/modifyProject/:project_number', (req, res) => {
    try {
        const { project_number } = req.params
        const updateData = req.body

        const result = modifyProject(req.db, updateData, project_number)

        if (result.startsWith('Error')) {
            const statusCode = result.includes('not found') ? 404 : 400
            return res.status(statusCode).json({ error: result })
        }
        res.status(200).json({
            message: `Project ${project_number} was updated successfully`,
            status: result
        })
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// DELETE
router.delete('/deleteProject/:project_number', (req, res) => {
    try {
        const { project_number } = req.params
        const result = deleteProject(req.db, project_number)
        if (result.startsWith('Error')) {
            return res.status(404).json({ error: result })
        }
        res.status(200).json({
            message: `Project ${project_number} was deleted successfully`,
            status: result
        })
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// GET
router.get('/projects', (req, res) => {
    try {
        const data = getAllProjects(req.db)
        res.status(200).json(data)
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
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


export default (db) => {
    return router;
};