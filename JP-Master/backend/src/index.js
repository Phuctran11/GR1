import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Pool } from 'pg'

const app = express()
app.use(express.json())

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
