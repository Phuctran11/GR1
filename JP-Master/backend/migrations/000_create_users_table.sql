-- ============================================================
-- Migration: Create Users table
-- Description: Create the base Users table with authentication fields
-- Date: 2026-01-07
-- ============================================================

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username 
ON Users(username);

CREATE INDEX IF NOT EXISTS idx_users_email 
ON Users(email);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('000_create_users_table', 'Create base Users table with authentication fields')
ON CONFLICT (migration_name) DO NOTHING;
