-- ============================================================
-- Migration: Create Readings table
-- Description: Store AI-generated reading passages
-- Date: 2026-01-07
-- ============================================================

-- Create Readings table
CREATE TABLE IF NOT EXISTS Readings (
    reading_id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT NOT NULL,
    translation TEXT,
    romaji_enabled BOOLEAN DEFAULT FALSE,
    length VARCHAR(25) CHECK (length IN ('short','medium','long')) DEFAULT 'medium',
    genre VARCHAR(25) CHECK (genre IN ('life','work','school','travel','anime_manga','short_story','simple_news')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_readings_user_id 
ON Readings(user_id);

-- Create index for faster lookups by genre
CREATE INDEX IF NOT EXISTS idx_readings_genre 
ON Readings(genre);

-- Create index for faster lookups by length
CREATE INDEX IF NOT EXISTS idx_readings_length 
ON Readings(length);

-- Create index for faster lookups by created date
CREATE INDEX IF NOT EXISTS idx_readings_created_at 
ON Readings(created_at);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('006_create_readings_table', 'Create Readings table for AI-generated reading passages')
ON CONFLICT (migration_name) DO NOTHING;
