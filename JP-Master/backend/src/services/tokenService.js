import jwt from 'jsonwebtoken'

/**
 * Utility functions for JWT token operations
 */
export class TokenService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET
    }

    ensureSecretConfigured() {
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET not configured')
        }
    }

    generateToken(payload, expiresIn = '7d') {
        this.ensureSecretConfigured()
        return jwt.sign(payload, this.jwtSecret, { expiresIn })
    }

    verifyToken(token) {
        this.ensureSecretConfigured()
        return jwt.verify(token, this.jwtSecret)
    }

    getCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }
    }

    extractToken(req) {
        const headerToken = req.headers.authorization?.split(' ')[1]
        const cookieToken = req.cookies?.token
        return headerToken || cookieToken || null
    }
}
