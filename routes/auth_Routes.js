import express from 'express';
import { generateToken } from '../auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    const { managerName } = req.body;
    
    if (!managerName) {
        return res.status(400).json({ message: 'Manager name required' });
    }
    const token = generateToken(managerName);
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
    res.json({ message: `${managerName} has Logged in` });
});

router.post('/logout', (req, res) => {
    console.log(`[${new Date().toISOString()}] 📩 POST request received at ${req.originalUrl}`);
    res.clearCookie('token');
    res.json({ message: `Logged out` });
});

export default router;