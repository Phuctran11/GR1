-- Migration: Add full_name column to Users table
-- This migration handles adding full_name to existing Users table
-- If the column already exists, it will not cause an error

-- Step 1: Check if column exists, if not add it
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);

-- Step 2: Add updated_at column if not exists
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 3: Update existing records where full_name is NULL to use username
UPDATE Users
SET full_name = COALESCE(full_name, username)
WHERE full_name IS NULL;

-- Step 4: Verify the changes
SELECT user_id, username, email, full_name, created_at FROM Users LIMIT 5;
