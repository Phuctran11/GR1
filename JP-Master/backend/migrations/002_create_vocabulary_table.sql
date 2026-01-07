-- ============================================================
-- Migration: Create Vocabulary table
-- Description: Create vocabulary table for Japanese words with JLPT levels
-- Date: 2026-01-07
-- ============================================================

-- Create Vocabulary table
CREATE TABLE IF NOT EXISTS Vocabulary (
    vocab_id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    kana VARCHAR(50) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    jlpt_level VARCHAR(2) CHECK (jlpt_level IN ('N5','N4','N3','N2','N1','SP')),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups by JLPT level
CREATE INDEX IF NOT EXISTS idx_vocabulary_jlpt_level 
ON Vocabulary(jlpt_level);

-- Create index for faster lookups by topic
CREATE INDEX IF NOT EXISTS idx_vocabulary_topic 
ON Vocabulary(topic);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('002_create_vocabulary_table', 'Create Vocabulary table for Japanese words with JLPT levels')
ON CONFLICT (migration_name) DO NOTHING;
