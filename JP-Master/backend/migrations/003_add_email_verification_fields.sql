-- ============================================================
-- Migration: Add email verification fields to Users
-- Description: Track email verification status and timestamp
-- Date: 2025-12-18
-- ============================================================

-- Add email verification columns
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verified 
ON Users(email_verified);

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('003_add_email_verification_fields', 'Add email_verified and email_verified_at columns to Users table')
ON CONFLICT (migration_name) DO NOTHING;
