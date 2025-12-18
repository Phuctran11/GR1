import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

async function runMigrations() {
    const migrationsDir = path.join(process.cwd(), 'migrations')

    try {
        // Ensure migrations_history table exists
        console.log('📋 Checking migrations history table...')
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations_history (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                description TEXT
            )
        `)
        console.log('✅ Migrations history table ready')

        // Get list of migration files
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql') && !f.includes('template'))
            .sort()

        console.log(`\n📂 Found ${files.length} migration files`)

        // Get executed migrations
        const result = await pool.query('SELECT migration_name FROM migrations_history')
        const executedMigrations = result.rows.map(r => r.migration_name)

        // Run pending migrations
        let executedCount = 0
        for (const file of files) {
            const migrationName = file.replace('.sql', '')
            
            if (executedMigrations.includes(migrationName)) {
                console.log(`⏭️  SKIP: ${migrationName} (already executed)`)
                continue
            }

            try {
                console.log(`\n▶️  Running: ${migrationName}`)
                const filePath = path.join(migrationsDir, file)
                const sql = fs.readFileSync(filePath, 'utf-8')
                
                await pool.query(sql)
                console.log(`✅ SUCCESS: ${migrationName}`)
                executedCount++
            } catch (err) {
                console.error(`❌ FAILED: ${migrationName}`)
                console.error(`Error: ${err.message}`)
                throw err
            }
        }

        console.log(`\n${'='.repeat(50)}`)
        console.log(`✅ Migration complete! ${executedCount} new migration(s) executed`)
        console.log(`${'='.repeat(50)}\n`)

    } catch (err) {
        console.error('❌ Migration failed:', err)
        process.exit(1)
    } finally {
        await pool.end()
    }
}

// Run migrations
runMigrations()
