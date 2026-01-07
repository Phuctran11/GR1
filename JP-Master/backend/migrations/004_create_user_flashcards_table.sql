-- ============================================================
-- Migration: Create UserFlashcards table
-- Description: Track user flashcard learning progress
-- Date: 2026-01-07
-- ============================================================

-- Create UserFlashcards table
CREATE TABLE IF NOT EXISTS UserFlashcards (
    user_id INT,
    vocab_id INT,
    status VARCHAR(15) CHECK (status IN ('remembered','not_remembered')) DEFAULT 'not_remembered',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id) ON DELETE CASCADE
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_user_flashcards_user_id 
ON UserFlashcards(user_id);

-- Create index for faster lookups by status
CREATE INDEX IF NOT EXISTS idx_user_flashcards_status 
ON UserFlashcards(status);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('004_create_user_flashcards_table', 'Create UserFlashcards table to track user learning progress')
ON CONFLICT (migration_name) DO NOTHING;
