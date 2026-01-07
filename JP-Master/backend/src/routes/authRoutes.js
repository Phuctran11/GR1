import express from 'express'
import { AuthController } from '../controllers/authController.js'

const router = express.Router()

export function setupAuthRoutes(app, pool) {
    const authController = new AuthController(pool)

    app.post('/api/auth/signup', authController.signup)
    app.post('/api/auth/login', authController.login)
    app.post('/api/auth/verify', authController.verify)
    app.post('/api/auth/logout', authController.logout)
}

export default router
