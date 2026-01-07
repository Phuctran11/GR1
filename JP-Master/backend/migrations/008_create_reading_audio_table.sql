-- ============================================================
-- Migration: Create ReadingAudio table
-- Description: Store audio files for reading passages
-- Date: 2026-01-07
-- ============================================================

-- Create ReadingAudio table
CREATE TABLE IF NOT EXISTS ReadingAudio (
    audio_id SERIAL PRIMARY KEY,
    reading_id INT,
    gender VARCHAR(6) CHECK (gender IN ('male','female')),
    speed VARCHAR(4) CHECK (speed IN ('0.75','1','1.25')) DEFAULT '1',
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id) ON DELETE CASCADE
);

-- Create index for faster lookups by reading
CREATE INDEX IF NOT EXISTS idx_reading_audio_reading_id 
ON ReadingAudio(reading_id);

-- Create index for faster lookups by gender
CREATE INDEX IF NOT EXISTS idx_reading_audio_gender 
ON ReadingAudio(gender);

-- Create index for faster lookups by speed
CREATE INDEX IF NOT EXISTS idx_reading_audio_speed 
ON ReadingAudio(speed);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('008_create_reading_audio_table', 'Create ReadingAudio table to store audio files for readings')
ON CONFLICT (migration_name) DO NOTHING;
