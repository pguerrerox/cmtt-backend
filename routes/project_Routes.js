import express from 'express'

const router = express.Router()

router.get('/update', (req, res) => {
    try {
        // update database with projects from excel file
        console.log("refresh all projects")
        res.json('refreshed')
    }
    catch (err) {
        console.error('Error fetching projects: ', err);
    }
})
router.get('/', (req, res) => {
    try {
        // return all the projects in the database
        console.log("project.route")
        res.json('hola')
    }
    catch (err) {
        console.error('Error fetching projects: ', err);
    }
})


export default (db) => {
    // Pass the db instance to each route handler
    router.use((req, res, next) => {
        req.db = db;
        next();
    });
    return router;
};