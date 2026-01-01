import jwt from 'jsonwebtoken'

/**
 * Middleware xác thực JWT, gắn thông tin user vào req.user
 */
export function authRequired(req, res, next) {
    try {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
        if (!token) {
            return res.status(401).json({ error: 'Thiếu token' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token không hợp lệ' })
    }
}
