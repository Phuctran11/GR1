-- ============================================================
-- Migration: Create UserSelectedVocab table
-- Description: Track vocabulary selected by users for review
-- Date: 2026-01-07
-- ============================================================

-- Create UserSelectedVocab table
CREATE TABLE IF NOT EXISTS UserSelectedVocab (
    user_id INT,
    vocab_id INT,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id) ON DELETE CASCADE
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_user_selected_vocab_user_id 
ON UserSelectedVocab(user_id);

-- Create index for faster lookups by selected date
CREATE INDEX IF NOT EXISTS idx_user_selected_vocab_selected_at 
ON UserSelectedVocab(selected_at);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('005_create_user_selected_vocab_table', 'Create UserSelectedVocab table to track vocabulary selected for review')
ON CONFLICT (migration_name) DO NOTHING;
