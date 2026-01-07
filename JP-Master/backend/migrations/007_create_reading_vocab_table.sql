-- ============================================================
-- Migration: Create ReadingVocab table
-- Description: Link readings with vocabulary words
-- Date: 2026-01-07
-- ============================================================

-- Create ReadingVocab table
CREATE TABLE IF NOT EXISTS ReadingVocab (
    reading_id INT,
    vocab_id INT,
    PRIMARY KEY (reading_id, vocab_id),
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id) ON DELETE CASCADE
);

-- Create index for faster lookups by reading
CREATE INDEX IF NOT EXISTS idx_reading_vocab_reading_id 
ON ReadingVocab(reading_id);

-- Create index for faster lookups by vocab
CREATE INDEX IF NOT EXISTS idx_reading_vocab_vocab_id 
ON ReadingVocab(vocab_id);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('007_create_reading_vocab_table', 'Create ReadingVocab table to link readings with vocabulary')
ON CONFLICT (migration_name) DO NOTHING;
