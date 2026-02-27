import express from 'express'
import {
    createFacility,
    updateFacility,
    deleteFacility,
    getAllFacilities,
    getFacilityById
} from '../repositories/facilities.repo.js'

const router = express.Router()

router.post('/facilities', (req, res) => {
    try {
        const result = createFacility(req.db, req.body)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error')
                ? 500
                : result.error === 'customer not found'
                    ? 404
                    : 400
            return res.status(statusCode).json(result)
        }
        return res.status(201).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.patch('/facilities/:id', (req, res) => {
    try {
        const result = updateFacility(req.db, req.params.id, req.body)
        if (!result.ok) {
            const statusCode = result.error === 'facility not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : result.error === 'customer not found'
                        ? 404
                        : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.delete('/facilities/:id', (req, res) => {
    try {
        const result = deleteFacility(req.db, req.params.id)
        if (!result.ok) {
            const statusCode = result.error === 'facility not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/facilities', (req, res) => {
    try {
        const result = getAllFacilities(req.db)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/facilities/:id', (req, res) => {
    try {
        const result = getFacilityById(req.db, req.params.id)
        if (!result.ok) {
            const statusCode = result.error === 'facility not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router
