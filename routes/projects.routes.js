import express from 'express'
import {
    createProject,
    getAllProjects,
    getProjectByProjectNumber,
    getProjectsByProjectManager,
} from '../repositories/projects.repo.js'

const router = express.Router()

// POST
router.post('/createProject', (req, res)=>{
    try{
        const result = createProject(req.db, req.body)
        if(result.startsWith('Error')){
            return res.status(409).json({error: result})
        }
        res.status(201).json({
            message: `Project ${req.body.project_number} was created successfully`,
            status: result
        })
    }
    catch(err){
        console.error(`Route Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// GET
router.get('/projects', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const data = getAllProjects(req.db)
        res.json(data)
    }
    catch (err) {
        console.error(`Error fetching projects: ${err}`);
        res.status(500).json({ error: err.message })
    }
})
router.get('/projects/:project_manager', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        const project_manager = req.params.project_manager        
        if (/^[a-zA-Z]+$/.test(project_manager)) {
            res.json(getProjectsByProjectManager(req.db, project_manager))
        } else {
            const err = new Error(`Project Manager "${req.params.project_manager}" is not valid`);
            console.error(`Error: ${err}`)
            res.status(500).json({ error: err.message })
        }
    }
    catch (err) {
        console.error(`Error fetching projects: ${err}`);
        res.status(500).json({ error: err.message })
    }
})
router.get('/search-project/:project_number', (req, res) => {
    console.log(`[${new Date().toISOString()}] 🔄 GET request received at ${req.originalUrl}`);
    try {
        if (/^\d{6}$/.test(req.params.project_number)) {
            res.json(getProjectByProjectNumber(req.db, req.params.project_number))
        } else {
            const err = new Error(`Project Number "${req.params.project_number}" is not valid`);
            console.error(`Error: ${err}`)
            res.status(500).json({ error: err.message })
        }
    }
    catch (err) {
        console.error(`Error fetching project: ${err}`);
        res.status(500).json({ error: err.message })
    }
})

export default router;