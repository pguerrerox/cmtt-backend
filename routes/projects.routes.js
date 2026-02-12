import express from 'express'
import {
    createProject,
    modifyProject,
    deleteProject,
    getAllProjects,
    getProjectsByNumber,
    getProjectsByManager,
    getProjectsByCustomer,
} from '../repositories/projects.repo.js'

/**
 * PROJECT ROUTES
 *
 * Handles project CRUD and query endpoints.
 * Expects `req.db` to contain an initialized better-sqlite3 connection.
 *
 * Endpoints:
 * - POST /createProject: Creates a new project
 * - PATCH /modifyProject/:project_number: Updates an existing project by project number
 * - DELETE /deleteProject/:project_number: Deletes a project by project number
 * - GET /projects: Retrieves all projects
 * - GET /projects/manager/:manager_id: Retrieves projects filtered by manager ID
 * - GET /projects/customer/:customer_name: Retrieves projects filtered by customer name
 * - GET /projects/:project_number: Retrieves one project by project number
**/

const router = express.Router()

// POST
router.post('/createProject', (req, res) => {
    try {
        const result = createProject(req.db, req.body)
        if (!result.ok) {
            const statusCode = result.error === 'project already exists'
                ? 409
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
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

        if (!result.ok) {
            const statusCode = result.error === 'project not found'
                ? 404
                : result.error === 'project already exists'
                    ? 409
                    : result.error.startsWith('database error')
                        ? 500
                        : 400;
            return res.status(statusCode).json(result)
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
        if (!result.ok) {
            const statusCode = result.error === 'project not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
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
        const result = getAllProjects(req.db)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400;
            return res.status(statusCode).json(result)
        }
        res.status(200).json(result)
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get('/projects/manager/:manager_id', (req, res) => {
    try {
        const { manager_id } = req.params
        const result = getProjectsByManager(req.db, manager_id)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400;
            return res.status(statusCode).json(result)
        }
        res.status(200).json(result)
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get('/projects/customer/:customer_name', (req, res) => {
    try {
        const { customer_name } = req.params
        const result = getProjectsByCustomer(req.db, customer_name)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400;
            return res.status(statusCode).json(result)
        }
        res.status(200).json(result)
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get('/projects/:project_number', (req, res) => {
    try {
        const { project_number } = req.params
        const result = getProjectsByNumber(req.db, project_number)
        if (!result.ok) {
            const statusCode = result.error === 'project not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
        }
        res.status(200).json(result)
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;
