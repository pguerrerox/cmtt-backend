import express from 'express'
import {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getAllCustomers,
    getCustomerById
} from '../repositories/customers.repo.js'

const router = express.Router()

router.post('/customers', (req, res) => {
    try {
        const result = createCustomer(req.db, req.body)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error')
                ? 500
                : result.error.includes('not found')
                    ? 404
                    : 400
            return res.status(statusCode).json(result)
        }
        return res.status(201).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.patch('/customers/:id', (req, res) => {
    try {
        const result = updateCustomer(req.db, req.params.id, req.body)
        if (!result.ok) {
            const statusCode = result.error === 'customer not found'
                ? 404
                : result.error.startsWith('database error')
                    ? 500
                    : result.error.includes('not found')
                        ? 404
                        : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.delete('/customers/:id', (req, res) => {
    try {
        const result = deleteCustomer(req.db, req.params.id)
        if (!result.ok) {
            const statusCode = result.error === 'customer not found'
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

router.get('/customers', (req, res) => {
    try {
        const result = getAllCustomers(req.db)
        if (!result.ok) {
            const statusCode = result.error.startsWith('database error') ? 500 : 400
            return res.status(statusCode).json(result)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/customers/:id', (req, res) => {
    try {
        const result = getCustomerById(req.db, req.params.id)
        if (!result.ok) {
            const statusCode = result.error === 'customer not found'
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
