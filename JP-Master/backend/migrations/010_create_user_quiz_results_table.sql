-- ============================================================
-- Migration: Create UserQuizResults table
-- Description: Store user quiz answers and results
-- Date: 2026-01-07
-- ============================================================

-- Create UserQuizResults table
CREATE TABLE IF NOT EXISTS UserQuizResults (
    user_id INT,
    quiz_id INT,
    user_answer TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, quiz_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_user_quiz_results_user_id 
ON UserQuizResults(user_id);

-- Create index for faster lookups by is_correct status
CREATE INDEX IF NOT EXISTS idx_user_quiz_results_is_correct 
ON UserQuizResults(is_correct);

-- Create index for faster lookups by answered date
CREATE INDEX IF NOT EXISTS idx_user_quiz_results_answered_at 
ON UserQuizResults(answered_at);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('010_create_user_quiz_results_table', 'Create UserQuizResults table to store user quiz answers')
ON CONFLICT (migration_name) DO NOTHING;
