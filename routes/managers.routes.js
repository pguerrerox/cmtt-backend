import express from 'express'
import {
    getAllManagers,
    getManagerByName,
    getManagerById,
} from '../repositories/managers.repo.js'

/**
 * MANAGER ROUTES
 *
 * Handles manager read-only endpoints for general usage.
 * Expects `req.db` to contain an initialized better-sqlite3 connection.
 *
 * Endpoints:
 * - GET /managers: Retrieves all managers
 * - GET /manager/name/:name: Retrieves one manager by name
 * - GET /manager/id/:id: Retrieves one manager by ID
**/

const router = express.Router()

// GET
router.get('/managers', (req, res) => {
    try {
        const result = getAllManagers(req.db)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400;
            return res.status(statusCode).json(result)
        }
        res.json(result.data);
    }
    catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: "Failed to retrieve managers" });
    }
})
router.get('/manager/name/:name',(req, res) =>{
    const { name } = req.params
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
        console.error(`Fetch Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})
router.get('/manager/id/:id', (req, res) => {
    const { id } = req.params
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
        console.error(`Fetch Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

export default router;
