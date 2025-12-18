-- ============================================================
-- Migration: Create migrations history table
-- Description: Track all executed migrations
-- Date: 2025-12-18
-- ============================================================

CREATE TABLE IF NOT EXISTS migrations_history (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Insert this migration as already executed
INSERT INTO migrations_history (migration_name, description)
VALUES ('001_create_migrations_table', 'Create migrations history tracking table')
ON CONFLICT (migration_name) DO NOTHING;
