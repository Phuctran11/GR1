-- ============================================================
-- Migration Template
-- Description: Use this as template for future migrations
-- ============================================================
-- 
-- Steps to create new migration:
-- 1. Copy this file: cp migration_template.sql 00X_your_migration_name.sql
-- 2. Replace XXX with next migration number (e.g., 003, 004, etc.)
-- 3. Replace YOUR_MIGRATION_NAME with descriptive name in SNAKE_CASE
-- 4. Write your SQL changes in the "YOUR CHANGES HERE" section
-- 5. Add the INSERT statement at the end
-- 6. Run: npm run migrate
--
-- ============================================================

-- ALTER TABLE table_name
-- ADD COLUMN new_column_name DATA_TYPE DEFAULT value;

-- Or DROP COLUMN if needed:
-- ALTER TABLE table_name
-- DROP COLUMN IF EXISTS column_name CASCADE;

-- Or MODIFY COLUMN:
-- ALTER TABLE table_name
-- ALTER COLUMN column_name SET NOT NULL;

-- Or ADD CONSTRAINT:
-- ALTER TABLE table_name
-- ADD CONSTRAINT constraint_name UNIQUE (column_name);

-- Record this migration (KEEP THIS AT THE END)
-- INSERT INTO migrations_history (migration_name, description)
-- VALUES ('00X_your_migration_name', 'Your description here')
-- ON CONFLICT (migration_name) DO NOTHING;
