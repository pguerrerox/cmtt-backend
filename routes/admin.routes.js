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
 * ADMIN ROUTES - MANAGERS
 *
 * Handles manager CRUD endpoints for admin usage.
 * Expects `req.db` to contain an initialized better-sqlite3 connection.
 *
 * Endpoints:
 * - POST /admin/createManager: Creates a new manager
 * - PUT /admin/updateManager/:id: Updates an existing manager by ID (full update)
 * - DELETE /admin/deleteManager/:id: Deletes a manager by ID
 * - GET /admin/managers: Retrieves all managers
 * - GET /admin/manager/name/:name: Retrieves one manager by name
 * - GET /admin/manager/id/:id: Retrieves one manager by ID
**/

const router = express.Router()

router.post('/admin/createManager', (req, res) => {
    const { fullname } = req.body
    try {
        const result = createManager(req.db, req.body);
        if (!result.ok) {
            return res.status(409).json({ error: result.error })
        }
        res.status(201).json({ message: `Manager ${fullname} was added successfully` })
    }
    catch (err) {
        console.error(`Create Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

router.put('/admin/updateManager/:id', (req, res) => {
    const { id } = req.params
    try {
        const result = updateManager(req.db, id, req.body);
        if (!result.ok) {
            return res.status(404).json({ error: result.error })
        }
        res.status(200).json({ message: `Manager ${id} was updated successfully.` })
    }
    catch (err) {
        console.error(`Update Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

router.delete('/admin/deleteManager/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = deleteManager(req.db, id);
        if (!result.ok) {
            return res.status(404).json({ error: result.error })
        }
        res.json({ message: `Manager ${id} has been removed` })
    }
    catch (err) {
        console.error(`Delete Error: ${err}`)
        res.status(500).json({ error: err.message });
    }
})

router.get('/admin/managers', (req, res) => {
    try {
        const result = getAllManagers(req.db);
        if (!result.ok) {
            return res.status(500).json({ error: result.error })
        }
        res.json(result.data);
    } catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: "Failed to retrieve managers" });
    }
});

router.get('/admin/manager/name/:name', (req, res) => {
    const { name } = req.params;
    try {
        const result = getManagerByName(req.db, name)
        if (!result.ok) {
            return res.status(404).json({ error: result.error })
        }
        res.json(result.data)
    }
    catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

router.get('/admin/manager/id/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = getManagerById(req.db, id)
        if (!result.ok) {
            return res.status(404).json({ error: result.error })
        }
        res.json(result.data)
    }
    catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

export default router;