import express from 'express'
import { createManager } from '../services/managers_Serv.js'

const router = express.Router()

//POST
router.post('/admin/createManager', (req, res)=>{
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    try {
        console.log(req.body);
        createManager(req.db, req.body)
        res.json({message: 'operation completed'})
    }
    catch(err){
        console.error(`Error on ${req.originalUrl} - ${err}`);
        res.status(500).json({ error: err.message })
    }
})

export default (db) => {
    return router;
};