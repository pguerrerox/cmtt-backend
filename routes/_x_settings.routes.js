import express from 'express'
import {
    saveStore
} from '../repositories/settings.repo.js'

const router = express.Router()
router.post('/save-settings', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const user = req.body.user
        const store_name = req.body.store_name
        const store_state = JSON.stringify(req.body.store_state)

        saveStore(req.db, user, store_name, store_state)
        res.json({ message: `State saved` })
    }
    catch (err) {
        console.error('Error at POST-"/save-settings": ', err);
        res.status(500).json({ error: err.message })
    }
})


export default (db) => {
    return router;
};