import express from 'express'
import { insertProjects } from '../services/projects.js'
import dataReadyForSQLite from '../helpers/excel_DataReadyForSQLite.js'


const router = express.Router()

router.post('/update', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at /api/projects/update`);
    try {
        const data = dataReadyForSQLite()
        const insertedRows = insertProjects(req.db, data)
        res.json({ message: `Inserted ${insertedRows} projects` })
    }
    catch (err) {
        console.error('Error fetching projects: ', err)
        res.status(500).json({ error: err.message })
    }
})

// router.get('/refresh', (req, res) => {
//     try {
//         // fetch projects from DB
//         console.log("project.route")
//         res.json('hola')
//     }
//     catch (err) {
//         console.error('Error fetching projects: ', err);
//     }
// })

export default (db) => {
    return router;
};