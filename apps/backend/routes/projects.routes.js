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
 * Project routes.
 *
 * Base path: `/api`
 * Responsibility: project CRUD and query endpoints.
 * Dependency: expects `req.db` to be attached by app middleware.
 */

const router = express.Router()

/**
 * POST /createProject
 * Creates a project and returns lookup status.
 */
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
            lookup_status: result.lookup_status,
            status: result
        })
    }
    catch (err) {
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

/**
 * PATCH /modifyProject/:project_number
 * Updates a project by project number.
 */
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

/**
 * DELETE /deleteProject/:project_number
 * Deletes a project by project number.
 */
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

/**
 * GET /projects
 * Returns all projects.
 */
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

/**
 * GET /projects/manager/:manager_id
 * Returns projects for one manager id.
 */
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

/**
 * GET /projects/customer/:customer_name
 * Returns projects for one customer.
 */
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

/**
 * GET /projects/:project_number
 * Returns one project by project number.
 */
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
