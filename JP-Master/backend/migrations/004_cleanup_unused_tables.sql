-- ============================================================
-- Migration: Cleanup - Remove Unnecessary Tables
-- Description: Remove any unnecessary tables from previous migrations
-- Date: 2025-01-07
-- ============================================================

BEGIN;

-- Drop unused tables if they exist from previous migrations
DROP TABLE IF EXISTS UserQuizAnswers CASCADE;
DROP TABLE IF EXISTS ReadingQuizzes CASCADE;
DROP TABLE IF EXISTS UserReadings CASCADE;
DROP TABLE IF EXISTS ReadingVocab CASCADE;
DROP TABLE IF EXISTS Readings CASCADE;

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('004_cleanup_unused_tables', 'Drop any temporary/unused tables to keep schema clean')
ON CONFLICT (migration_name) DO NOTHING;

COMMIT;
