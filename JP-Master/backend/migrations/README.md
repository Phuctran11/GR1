# Database Schema Overview - PostgreSQL Migrations

## Tóm tắt

Project này sử dụng PostgreSQL với hệ thống migration để quản lý database schema. Tất cả các bảng và dữ liệu ban đầu được tạo thông qua migration files.

## Cấu trúc Database

### Core Tables

1. **Users** - Quản lý người dùng
   - Authentication: username, email, password_hash
   - Profile: full_name
   - Email verification: email_verified, email_verified_at
   - Timestamps: created_at, updated_at

2. **Vocabulary** - Từ vựng tiếng Nhật
   - 60 từ vựng mẫu (10 từ cho mỗi level)
   - JLPT Levels: N5, N4, N3, N2, N1, SP (Specialist)
   - Thông tin: word, kana, meaning, topic

### Learning Tables

3. **UserFlashcards** - Theo dõi tiến trình học flashcard
   - Status: remembered / not_remembered
   - Liên kết: user_id → vocab_id

4. **UserSelectedVocab** - Từ vựng được chọn để ôn tập
   - Timestamp: selected_at

### Reading Tables

5. **Readings** - Bài đọc do AI tạo
   - Metadata: title, length, genre
   - Content: content, translation
   - Options: romaji_enabled

6. **ReadingVocab** - Liên kết bài đọc với từ vựng

7. **ReadingAudio** - File audio cho bài đọc
   - Options: gender (male/female), speed (0.75/1/1.25)
   - Storage: audio_url

### Quiz Tables

8. **Quizzes** - Câu hỏi đọc hiểu
   - Question, correct_answer, wrong_answers

9. **UserQuizResults** - Kết quả quiz của user
   - Track: user_answer, is_correct, answered_at

### System Tables

10. **migrations_history** - Theo dõi migrations đã chạy

## Chạy Migrations

```bash
cd backend
npm install
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
npm run migrate
```

## Migration Files

Tất cả migration files nằm trong thư mục `backend/migrations/` và được đánh số tuần tự từ 000 đến 011.

Xem chi tiết trong file [MIGRATIONS.md](./MIGRATIONS.md)

## Features

✅ **Idempotent migrations** - Chạy lại nhiều lần không lỗi  
✅ **Foreign key constraints** - Đảm bảo data integrity  
✅ **Indexes** - Tối ưu query performance  
✅ **Check constraints** - Validate data types  
✅ **CASCADE deletes** - Tự động xóa dữ liệu liên quan  

## Database Diagram

```
Users (1) ──< UserFlashcards >── (1) Vocabulary
  │                                      │
  │ (1)                                  │ (1)
  │                                      │
  ├──< UserSelectedVocab >───────────────┤
  │                                      │
  │ (1)                                  │ (1)
  │                                      │
  ├──< Readings >── (1) ReadingVocab >──┤
  │       │ (1)
  │       ├──< ReadingAudio
  │       │ (1)
  │       └──< Quizzes >── (1) UserQuizResults >── (1) Users
  │                                                      
  └──────────────────────────────────────────────────────┘
```

## Next Steps

- Chạy migrations trên production database
- Configure DATABASE_URL trong .env
- Backup database trước khi deploy

## Support

Nếu có vấn đề với migrations, xem [MIGRATIONS.md](./MIGRATIONS.md) phần Troubleshooting.
