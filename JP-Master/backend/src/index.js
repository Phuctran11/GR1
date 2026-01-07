import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Pool } from 'pg'
import { setupAuthRoutes } from './routes/authRoutes.js'
import { setupFlashcardRoutes } from './routes/flashcardRoutes.js'
import { setupReadingRoutes } from './routes/readingRoutes.js'

const app = express()
app.use(express.json())

// parse cookies so server can read httpOnly token cookie
app.use(cookieParser())

// Require JWT secret in production
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set. Set JWT_SECRET in production environment for security.')
}

// In production, set a CORS whitelist via env `CORS_ORIGINS` (comma-separated). Defaults to common dev origins.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true)
        }
        return callback(new Error('CORS policy: this origin is not allowed'))
    },
    credentials: true,
}))

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

function maskDatabaseUrl(url) { // che mật khẩu khi in ra log
    if (!url) return url
    // mask password between : and @ (e.g. postgresql://user:pass@host)
    return url.replace(/:(.*)@/, ':*****@')
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
    console.log(`Backend listening on ${port}`)

    // masked env log
    const hasDb = !!process.env.DATABASE_URL
    console.log('DATABASE_URL set?', hasDb)
    if (hasDb) {
        console.log('DATABASE_URL (masked):', maskDatabaseUrl(process.env.DATABASE_URL))
    }


    // Setup auth routes
    setupAuthRoutes(app, pool)
    console.log('Auth routes initialized')

    // Setup flashcard routes
    setupFlashcardRoutes(app, pool)
    console.log('Flashcard routes initialized')

    // Setup AI reading routes
    setupReadingRoutes(app, pool)
    console.log('Reading routes initialized')

    // quick DB check on startup
    ;(async () => {
        try {
            await pool.query('SELECT 1')
            console.log('Postgres: connection OK')
        } catch (err) {
            console.error('Postgres: connection failed -', err.message || err)
        }
    })()
})

async function shutdown(signal) {
    console.log(`Received ${signal}. Closing server and DB pool...`)
    try {
        await pool.end()
        console.log('Postgres pool closed')
    } catch (err) {
        console.error('Error closing Postgres pool', err)
    }
    server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
    })
    // force exit if close hangs
    // đảm bảo tiến trình kết thúc ngay cả khi có lỗi treo
    setTimeout(() => {
        console.warn('Forcing shutdown')
        process.exit(1)
    }, 10000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception', err)
    shutdown('uncaughtException')
})
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection', reason)
    shutdown('unhandledRejection')
})
