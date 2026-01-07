-- Migration: Add Readings table for AI-generated content
-- Purpose: Store temporary readings created by AI with auto-cleanup

CREATE TABLE IF NOT EXISTS Readings (
    reading_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    romaji_enabled BOOLEAN DEFAULT FALSE,
    length VARCHAR(20),
    genre VARCHAR(100),
    is_temporary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_readings_user ON Readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_temporary ON Readings(is_temporary);
CREATE INDEX IF NOT EXISTS idx_readings_expires ON Readings(expires_at);
