import express from 'express'
import { verifyToken } from '../auth.js'
import {
    insertManagers,
    getManagers,
    getActiveManagers
} from '../services/managers.js'


const router = express.Router()
router.post('/insert', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const insertedManagers = insertManagers(req.db)
        res.json({ message: `Inserted ${insertedManagers} managers` })
     }
    catch (err) {
        console.error('Error at POST-"/update-managers": ', err);
        res.status(500).json({ error: err.message })
    }



})

router.get('/managers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getAllProjectManagers(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error on ${req.originalUrl}: ${err}`);
        res.status(500).json({ error: err.message })
    }
})
router.get('managers-active', () => { })


export default (db) => {
    return router;
};