import express from 'express'
import {
    createManager,
    updateManager,
    deleteManager,
    getAllManagers,
    getManagerByName,
    getManagerById
} from '../repositories/managers.repo.js'

/**
 * Admin manager routes.
 *
 * Base path: `/api`
 * Responsibility: manager CRUD endpoints intended for admin usage.
 * Dependency: expects `req.db` to be attached by app middleware.
 */

const router = express.Router()

/**
 * POST /admin/createManager
 * Creates a manager record.
 */
router.post('/admin/createManager', (req, res) => {
    const { fullname } = req.body
    try {
        const result = createManager(req.db, req.body);
        if (!result.ok) {
            const statusCode = result.error === 'manager already exists'
                ? 409
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
        }
        res.status(201).json({ message: `Manager ${fullname} was added successfully` })
    }
    catch (err) {
        console.error(`Create Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

/**
 * PATCH /admin/updateManager/:id
 * Updates an existing manager by id.
 */
router.patch('/admin/updateManager/:id', (req, res) => {
    const { id } = req.params
    try {
        const result = updateManager(req.db, id, req.body);
        if (!result.ok) {
            const statusCode = result.error === 'manager not found'
                ? 404
                : result.error === 'manager already exists'
                    ? 409
                    : result.error.startsWith('database error')
                        ? 500
                        : 400;
            return res.status(statusCode).json(result)
        }
        res.status(200).json({ message: `Manager ${id} was updated successfully.` })
    }
    catch (err) {
        console.error(`Update Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

/**
 * DELETE /admin/deleteManager/:id
 * Removes a manager by id.
 */
router.delete('/admin/deleteManager/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = deleteManager(req.db, id);
        if (!result.ok) {
            const statusCode = result.error === 'manager not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
        }
        res.json({ message: `Manager ${id} has been removed` })
    }
    catch (err) {
        console.error(`Delete Error: ${err}`)
        res.status(500).json({ error: err.message });
    }
})

/**
 * GET /admin/managers
 * Returns all managers.
 */
router.get('/admin/managers', (req, res) => {
    try {
        const result = getAllManagers(req.db);
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400;
            return res.status(statusCode).json(result)
        }
        res.json(result.data);
    } catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: "Failed to retrieve managers" });
    }
})

/**
 * GET /admin/manager/name/:name
 * Returns a manager by username.
 */
router.get('/admin/manager/name/:name', (req, res) => {
    const { name } = req.params;
    try {
        const result = getManagerByName(req.db, name)
        if (!result.ok) {
            const statusCode = result.error === 'manager not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
        }
        res.json(result.data)
    }
    catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

/**
 * GET /admin/manager/id/:id
 * Returns a manager by id.
 */
router.get('/admin/manager/id/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = getManagerById(req.db, id)
        if (!result.ok) {
            const statusCode = result.error === 'manager not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400;
            return res.status(statusCode).json(result)
        }
        res.json(result.data)
    }
    catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

export default router;
