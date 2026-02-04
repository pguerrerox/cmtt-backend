import express from 'express'
import { verifyToken } from '../auth.js'
// import dataReadyForSQLite from '../helpers/excel_DataReadyForSQLite.js'
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
// AUTH NOT REQUIRED
// router.get('/projects', (req, res) => {
//     console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
//     try {
//         const data = getAllProjects(req.db)
//         res.json(data)
//     }
//     catch (err) {
//         console.error(`Error fetching projects: ${err}`);
//         res.status(500).json({ error: err.message })
//     }
// })
// router.get('/projects/:project_manager', (req, res) => {
//     console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
//     try {
//         const project_manager = req.params.project_manager        
//         if (/^[a-zA-Z]+$/.test(project_manager)) {
//             res.json(getProjectsByProjectManager(req.db, project_manager))
//         } else {
//             const err = new Error(`Project Manager "${req.params.project_manager}" is not valid`);
//             console.error(`Error: ${err}`)
//             res.status(500).json({ error: err.message })
//         }
//     }
//     catch (err) {
//         console.error(`Error fetching projects: ${err}`);
//         res.status(500).json({ error: err.message })
//     }
// })
// router.get('/search-project/:project_number', (req, res) => {
//     console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
//     try {
//         if (/^\d{6}$/.test(req.params.project_number)) {
//             res.json(getProjectByProjectNumber(req.db, req.params.project_number))
//         } else {
//             const err = new Error(`Project Number "${req.params.project_number}" is not valid`);
//             console.error(`Error: ${err}`)
//             res.status(500).json({ error: err.message })
//         }
//     }
//     catch (err) {
//         console.error(`Error fetching project: ${err}`);
//         res.status(500).json({ error: err.message })
//     }
// })

// // ###############
// // AUTH REQUIRED
// router.post('/update-projects', verifyToken, (req, res) => {
//     console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
//     try {
//         const data = dataReadyForSQLite()
//         const insertedRows = insertProjects(req.db, data)
//         res.json({ message: `Inserted ${insertedRows} projects` })
//     }
//     catch (err) {
//         console.error('Error at POST-"/update-database": ', err)
//         res.status(500).json({ error: err.message })
//     }
// })


export default (db) => {
    return router;
};