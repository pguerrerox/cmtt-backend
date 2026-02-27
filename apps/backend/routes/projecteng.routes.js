import express from 'express'
import { getAllProjectEng, getProjectEngById } from '../repositories/projecteng.repo.js'

const router = express.Router()

router.get('/projecteng', (req, res) => {
    try {
        const result = getAllProjectEng(req.db)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/projecteng/:id', (req, res) => {
    try {
        const result = getProjectEngById(req.db, req.params.id)
        if (!result.ok) {
            const statusCode = result.error === 'project engineer not found'
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
