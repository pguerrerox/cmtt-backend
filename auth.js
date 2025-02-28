import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'developing key';

export const generateToken = (managerName) => {
    return jwt.sign({ managerName }, JWT_SECRET_KEY, { expiresIn: '24h' })
}
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) { return res.status(401).json({ message: 'Unauthorized' }) }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        req.managerName = decoded.managerName
        next()
    }
    catch (err) {
        res.status(403).json({ message: "Invalid Token" })
    }
}
