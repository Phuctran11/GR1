-- ============================================================
-- Migration: Create Complete Database Schema
-- Description: Create all necessary tables for JP-Master application
-- Date: 2025-01-07
-- ============================================================

BEGIN;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng từ vựng
CREATE TABLE IF NOT EXISTS Vocabulary (
    vocab_id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    kana VARCHAR(50) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    jlpt_level VARCHAR(2) CHECK (jlpt_level IN ('N5','N4','N3','N2','N1','SP')),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tiến độ flashcard của người dùng
CREATE TABLE IF NOT EXISTS UserFlashcards (
    user_flashcard_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    vocab_id INTEGER NOT NULL REFERENCES Vocabulary(vocab_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'learning', 'remembered', 'forgotten')),
    review_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vocab_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);

CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON Vocabulary(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_topic ON Vocabulary(topic);

CREATE INDEX IF NOT EXISTS idx_userflashcards_user ON UserFlashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_userflashcards_vocab ON UserFlashcards(vocab_id);
CREATE INDEX IF NOT EXISTS idx_userflashcards_status ON UserFlashcards(status);
CREATE INDEX IF NOT EXISTS idx_userflashcards_updated ON UserFlashcards(updated_at);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('002_create_complete_schema', 'Create complete database schema with all necessary tables and indexes')
ON CONFLICT (migration_name) DO NOTHING;

COMMIT;
