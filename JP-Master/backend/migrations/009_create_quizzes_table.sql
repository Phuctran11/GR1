-- ============================================================
-- Migration: Create Quizzes table
-- Description: Store reading comprehension quiz questions
-- Date: 2026-01-07
-- ============================================================

-- Create Quizzes table
CREATE TABLE IF NOT EXISTS Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    reading_id INT,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answers TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id) ON DELETE CASCADE
);

-- Create index for faster lookups by reading
CREATE INDEX IF NOT EXISTS idx_quizzes_reading_id 
ON Quizzes(reading_id);

-- Create index for faster lookups by created date
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at 
ON Quizzes(created_at);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('009_create_quizzes_table', 'Create Quizzes table for reading comprehension questions')
ON CONFLICT (migration_name) DO NOTHING;
