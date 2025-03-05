import express from 'express'
import { verifyToken } from '../auth.js'
import {
    insertAllManagers,
    getAllManagers,
    updateAllManagers,
    getActiveManagers
} from '../services/managersServ.js'


const router = express.Router()
router.post('/set-managers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const managersInserted = insertAllManagers(req.db)
        res.json({ message: `Inserted ${managersInserted} managers` })
     }
    catch (err) {
        console.error('Error at POST-"/update-managers": ', err);
        res.status(500).json({ error: err.message })
    }
})
router.get('/managers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getAllManagers(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error on ${req.originalUrl}: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

// CHECK HERE
router.post('/update-managers', (req, res)=>{
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const updatedManagers = updateAllManagers(req.db, )
        res.json({ message: `Inserted ${managersInserted} managers` })
     }
    catch (err) {
        console.error('Error at POST-"/update-managers": ', err);
        res.status(500).json({ error: err.message })
    }
})

router.get('managers-active', () => { })


export default (db) => {
    return router;
};