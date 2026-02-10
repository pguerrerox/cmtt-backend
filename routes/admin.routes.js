import express from 'express'
import { 
    createManager, 
    updateManager, 
    deleteManager,
    getAllManagers,
    getManagerByName,
    getManagerById
} from '../repositories/managers.repo.js'

const router = express.Router()

// POST
router.post('/admin/createManager', (req, res) => {
    const {fullname} = req.body
    try {
        const result = createManager(req.db, req.body);
        if (result.startsWith('Error')){
            return res.status(409).json({error: result})
        }
        res.json({message: `Manager ${fullname} was added successfully`})
    }
    catch (err) {
        console.error(`Create Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

// PUT
router.put('/admin/updateManager/:id', (req, res) => {
    const { id } = req.params
    try {
        const result = updateManager(req.db, id, req.body);
        if (result.startsWith('Error')) {
            return res.status(404).json({ error: result })
        }
        res.status(201).json({ message: `Manager ${id} was updated successfully.` })
    }
    catch (err) {
        console.error(`Update Error: ${err}`)
        res.status(500).json({ error: err.message })
    }
})

// DELETE
router.delete('/admin/deleteManager/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = deleteManager(req.db, id);    
        if (result.startsWith('Error')) {
            return res.status(404).json({ error: result })
        }
        res.json({ message: `Manager ${id} has been removed` })
    }
    catch (err) {
        console.error(`Delete Error: ${err}`)
        res.status(500).json({ error: err.message });
    }
})

// GET
router.get('/admin/managers', (req, res) => {
    try {
        const managers = getAllManagers(req.db);
        res.json(managers);
    } catch (err) {
        console.error(`Fetch Error: ${err}`);
        res.status(500).json({ error: "Failed to retrieve managers" });
    }
});
router.get('/admin/manager/name/:name', (req, res) => {
    const { name } = req.params;
    try {
        const manager = getManagerByName(req.db, name)
        if(!manager){
            return res.status(404).json({error: "Manager not found"})
        }
        res.json(manager)
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
})
router.get('/admin/manager/id/:id', (req, res)=>{
        const { id } = req.params;
    try {
        const manager = getManagerById(req.db, id)
        if(!manager){
            return res.status(404).json({error: "Manager not found"})
        }
        res.json(manager)
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router;