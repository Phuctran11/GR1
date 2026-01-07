"# JP-Master - Japanese Learning Platform

> Ứng dụng học tiếng Nhật thông minh với AI hỗ trợ tạo nội dung, flashcard, và quiz tương tác

![Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-Express-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)

---

## 📖 Giới thiệu

**JP-Master** là nền tảng học tiếng Nhật toàn diện, tích hợp AI (Google Gemini) để tạo nội dung học tập cá nhân hóa. Ứng dụng giúp người học:

- 📚 **Học từ vựng** qua hệ thống flashcard thông minh (JLPT N5-N1)
- 📝 **Đọc bài tập** được AI tạo tự động dựa trên từ vựng đã học
- 🎧 **Nghe phát âm** với Google Text-to-Speech
- ✅ **Làm quiz** kiểm tra hiểu biết về bài đọc
- 📊 **Theo dõi tiến độ** học tập cá nhân

---

## ✨ Tính năng chính

### 🎴 Flashcard System
- Hệ thống 60+ từ vựng tiếng Nhật (N5-N1, Specialized IT)
- Theo dõi trạng thái học: New → Learning → Remembered → Forgotten
- Hiển thị tiến độ theo level (N5, N4, N3, N2, N1)
- Review count và thời gian học gần nhất

### 📖 AI Reading Generation
- Tạo bài đọc tiếng Nhật tự động bằng Google Gemini AI
- Chọn thể loại: Life, Work, School, Travel, Anime/Manga, Short Story, News
- 3 độ dài: Short (80-120 chữ), Medium (150-220), Long (250-350)
- Bắt buộc chứa từ vựng đã chọn
- Bản dịch tiếng Việt tự động
- Romaji option

### 🎧 Text-to-Speech
- Chuyển text tiếng Nhật thành audio
- Sử dụng Google TTS API
- Hỗ trợ bài đọc dài (auto-split)

### 🧠 Quiz Generator
- AI tạo câu hỏi trắc nghiệm từ bài đọc
- Câu hỏi và đáp án bằng tiếng Nhật
- Giải thích bằng tiếng Việt
- Phân loại độ khó: Easy/Medium/Hard

### 🔐 Authentication
- Đăng ký/Đăng nhập JWT-based
- Session management với cookies
- Protected routes

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI Framework
- **React Router 6** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Icons** - Icon library

### Backend
- **Node.js + Express 5** - REST API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - Text generation
- **Google TTS** - Audio generation

### Database Schema
- **Users** - User accounts
- **Vocabulary** - Shared vocabulary database
- **UserFlashcards** - User progress tracking
- **Readings** - Generated reading content (TTL 3 days)

---

## 📁 Project Structure

```
JP-Master/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Helper functions
│   │   └── apiClient.js  # API integration
│   └── package.json
│
├── backend/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   │   ├── aiService.js
│   │   │   ├── textGenerationService.js
│   │   │   ├── audioService.js
│   │   │   ├── quizService.js
│   │   │   ├── flashcardService.js
│   │   │   └── authService.js
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Auth middleware
│   ├── migrations/       # Database migrations
│   └── package.json
│
└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API Key

### 1. Clone repository
```bash
git clone <repository-url>
cd JP-Master
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Thêm GEMINI_API_KEY, DATABASE_URL, JWT_SECRET

# Run migrations
npm run migrate

# Start server
npm run dev  # Port 3000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev  # Port 5173
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Flashcards
- `GET /api/flashcards/progress/:level` - Get progress by level
- `POST /api/flashcards/save-progress` - Save flashcard progress

### Reading Generation
- `POST /api/readings/generate` - Generate reading
- `GET /api/readings/:id` - Get reading by ID
- `POST /api/readings/:id/quiz` - Generate quiz
- `POST /api/readings/:id/tts` - Generate audio

---

## 🎯 Roadmap

- [ ] **Phase 1** (Current)
  - [x] Flashcard system
  - [x] Reading generation
  - [x] Quiz generation
  - [x] TTS integration
  
- [ ] **Phase 2**
  - [ ] Spaced repetition algorithm
  - [ ] User vocabulary library
  - [ ] Reading history
  - [ ] Quiz results tracking
  
- [ ] **Phase 3**
  - [ ] Mobile responsive design
  - [ ] Dark mode
  - [ ] Social features (share readings)
  - [ ] Gamification (badges, streaks)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Team

Developed with ❤️ by [Your Team Name]

---

## 📧 Contact

For questions or support:
- Email: your-email@example.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

## 🙏 Acknowledgments

- Google Gemini AI for text generation
- Google TTS for audio generation
- JLPT vocabulary database
- React & Node.js communities
" 
