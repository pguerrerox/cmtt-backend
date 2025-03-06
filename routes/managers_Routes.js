import express from 'express'
import { verifyToken } from '../auth.js'
import {
    insertManagers,
    getManagers,
    updateManagers
} from '../services/managers_Serv.js'

const router = express.Router()

// ###############
// AUTH NOT REQUIRED
router.post('/insertmanagers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const managersInserted = insertManagers(req.db)
        res.json({ message: `Inserted ${managersInserted} managers` })
     }
    catch (err) {
        console.error('Error at POST-"/update-managers": ', err);
        res.status(500).json({ error: err.message })
    }
})
router.get('/getManagers', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getManagers(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error on ${req.originalUrl} - ${err}`);
        res.status(500).json({ error: err.message })
    }
})
router.post('/updateManagers', (req, res)=>{
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        const updatedManagers = updateManagers(req.db, )
        res.json({ message: `Inserted ${managersInserted} managers` })
     }
    catch (err) {
        console.error('Error at POST-"/update-managers": ', err);
        res.status(500).json({ error: err.message })
    }
})

// ###############
// AUTH REQUIRED



export default (db) => {
    return router;
};