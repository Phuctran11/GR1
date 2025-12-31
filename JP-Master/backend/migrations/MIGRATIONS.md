# 📚 Database Migrations Guide

## 📖 Tổng quan

Hệ thống migrations giúp bạn quản lý các thay đổi schema database theo thời gian. Mỗi thay đổi được lưu dưới dạng một file SQL riêng biệt, đảm bảo:

✅ **Version control**: Theo dõi tất cả thay đổi schema  
✅ **Rollback an toàn**: Biết chính xác những gì đã thay đổi  
✅ **Team collaboration**: Mọi người đều có cùng schema  
✅ **Audit trail**: Biết ai, khi nào thay đổi gì  

---

## 🚀 Cách sử dụng

### 1️⃣ **Chạy tất cả migrations**

```bash
cd backend
npm run migrate
```

Output:
```
📋 Checking migrations history table...
✅ Migrations history table ready

📂 Found 2 migration files

▶️  Running: 001_create_migrations_table
✅ SUCCESS: 001_create_migrations_table

⏭️  SKIP: 002_add_full_name_to_users (already executed)

==================================================
✅ Migration complete! 1 new migration(s) executed
==================================================
```

### 2️⃣ **Tạo migration mới**

**Bước 1**: Copy template
```bash
cp backend/migrations/migration_template.sql backend/migrations/003_your_migration_name.sql
```

**Bước 2**: Mở file và viết SQL changes
```sql
-- ============================================================
-- Migration: Add email_verified column
-- Description: Track if user has verified their email
-- ============================================================

ALTER TABLE Users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('003_add_email_verified_column', 'Add email_verified column to Users table')
ON CONFLICT (migration_name) DO NOTHING;
```

**Bước 3**: Chạy migration
```bash
npm run migrate
```

---

## 📋 Các loại thay đổi phổ biến

### ✏️ **Thêm cột mới**
```sql
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
```

### 🔄 **Sửa đổi cột**
```sql
-- Thay đổi kiểu dữ liệu
ALTER TABLE Users
ALTER COLUMN full_name SET NOT NULL;

-- Thêm constraint
ALTER TABLE Users
ADD CONSTRAINT email_unique UNIQUE (email);
```

### 🗑️ **Xóa cột**
```sql
ALTER TABLE Users
DROP COLUMN IF NOT EXISTS old_column CASCADE;
```

### 🔗 **Tạo Foreign Key**
```sql
ALTER TABLE UserFlashcards
ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
```

### 📊 **Tạo bảng mới**
```sql
CREATE TABLE IF NOT EXISTS UserProgress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

---

## 📁 Cấu trúc Migrations

```
backend/
├── migrations/
│   ├── 001_create_migrations_table.sql
│   ├── 002_add_full_name_to_users.sql
│   ├── 003_your_migration_name.sql
│   ├── migration_template.sql
│   └── MIGRATIONS.md (this file)
├── src/
│   ├── migrate.js (migration runner)
│   └── index.js
└── package.json
```

---

## 🔍 Theo dõi migrations đã thực thi

Kiểm tra những migrations đã chạy:

```sql
SELECT * FROM migrations_history ORDER BY executed_at DESC;
```

Kết quả:
```
 id |              migration_name              |         executed_at          |        description
----+------------------------------------------+------------------------------+---------------------------
  2 | 002_add_full_name_to_users               | 2025-12-18 10:30:45.123456   | Add full_name and updated_at columns to Users table
  1 | 001_create_migrations_table              | 2025-12-18 10:25:12.654321   | Create migrations history tracking table
```

---

## ⚠️ Best Practices

### ✅ DO:
- ✅ Mỗi migration là **một thay đổi logic** (thêm cột, tạo bảng, v.v.)
- ✅ Đặt tên file theo thứ tự: `00X_description.sql`
- ✅ Sử dụng `IF NOT EXISTS` / `IF EXISTS` để migration là **idempotent** (chạy lại không lỗi)
- ✅ Luôn có `INSERT INTO migrations_history` ở cuối mỗi migration
- ✅ Commit migrations vào git cùng với code changes
- ✅ Test migration trước khi push

### ❌ DON'T:
- ❌ Không edit migration cũ sau khi đã chạy (tạo migration mới thay vào)
- ❌ Không chạy SQL trực tiếp ngoài migrations
- ❌ Không để migration mà không có description
- ❌ Không xóa dữ liệu trong migration (nếu không cần thiết)

---

## 🔧 Troubleshooting

### Migration failed?

1. **Kiểm tra error message**:
   ```bash
   npm run migrate
   # Xem error chi tiết ở console
   ```

2. **Kiểm tra PostgreSQL connection**:
   ```bash
   echo $DATABASE_URL  # Check environment variable
   psql $DATABASE_URL -c "SELECT 1"  # Test connection
   ```

3. **Kiểm tra migrations_history table**:
   ```sql
   SELECT * FROM migrations_history;
   ```

4. **Manual fix nếu cần**:
   - Xóa migration from history
   - Fix SQL trong file
   - Chạy lại

---

## 📝 Ví dụ Migration hoàn chỉnh

```sql
-- ============================================================
-- Migration: Add user authentication fields
-- Description: Add email_verified, last_login, password_reset_token
-- Date: 2025-12-18
-- ============================================================

-- Add new columns
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_token 
ON Users(password_reset_token);

-- Update existing records
UPDATE Users
SET email_verified = TRUE
WHERE created_at < NOW() - INTERVAL '1 day';

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('004_add_auth_fields_to_users', 'Add email verification and password reset fields to Users table')
ON CONFLICT (migration_name) DO NOTHING;
```

---

## 🚀 Next: Tích hợp với CI/CD

Để chạy migrations tự động trước khi server start:

**Sửa `backend/src/index.js`:**
```javascript
import { runMigrations } from './migrate.js'

// Chạy migrations trước khi start server
await runMigrations()

const server = app.listen(port, () => {
    console.log(`Backend listening on ${port}`)
})
```

Hoặc chạy trong Docker:
```dockerfile
RUN npm run migrate
CMD npm run start
```
