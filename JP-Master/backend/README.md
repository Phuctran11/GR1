# JP-Master Backend

> Node.js REST API with AI integration for Japanese learning platform

---

## 🛠️ Tech Stack

### Core
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **PostgreSQL 8.16.3** - Relational database

### Authentication & Security
- **JWT (jsonwebtoken 9.0.0)** - Token-based auth
- **bcryptjs 2.4.3** - Password hashing
- **cookie-parser 1.4.7** - Cookie handling
- **cors 2.8.5** - Cross-Origin Resource Sharing

### AI & External Services
- **@google/generative-ai 0.24.1** - Gemini AI integration
- **google-tts-api 2.0.1** - Text-to-Speech generation

### Development
- **dotenv 17.2.3** - Environment variables
- **nodemon 3.1.10** - Auto-restart on changes
- **ES Modules** - Modern JavaScript syntax

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.js        # Auth endpoints
│   │   ├── flashcardController.js   # Flashcard logic
│   │   └── readingController.js     # Reading/Quiz/Audio
│   │
│   ├── services/              # Business logic (modular)
│   │   ├── aiService.js             # Gemini AI wrapper
│   │   ├── textGenerationService.js # Reading generation
│   │   ├── audioService.js          # TTS generation
│   │   ├── quizService.js           # Quiz generation
│   │   ├── flashcardService.js      # Flashcard logic
│   │   ├── authService.js           # Auth logic
│   │   └── tokenService.js          # JWT handling
│   │
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── flashcardRoutes.js
│   │   └── readingRoutes.js
│   │
│   ├── middleware/            # Express middleware
│   │   └── auth.js                  # JWT verification
│   │
│   ├── index.js               # Server entry point
│   └── migrate.js             # Migration runner
│
├── migrations/                # Database migrations
│   ├── 001_create_migrations_table.sql
│   ├── 002_create_complete_schema.sql
│   ├── 003_insert_sample_vocabulary.sql
│   ├── 004_cleanup_unused_tables.sql
│   ├── 005_add_readings_table.sql
│   └── MIGRATIONS.md
│
├── query.sql                  # Complete schema reference
├── package.json
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema

### Core Tables

#### **Users**
```sql
user_id         SERIAL PRIMARY KEY
username        VARCHAR(50) UNIQUE NOT NULL
email           VARCHAR(100) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
full_name       VARCHAR(100)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### **Vocabulary**
```sql
vocab_id        SERIAL PRIMARY KEY
word            VARCHAR(50) NOT NULL      -- Kanji/Kana
kana            VARCHAR(50) NOT NULL      -- Reading
meaning         VARCHAR(255) NOT NULL     -- Vietnamese translation
jlpt_level      VARCHAR(2)                -- N5, N4, N3, N2, N1, SP
topic           VARCHAR(100)              -- Category
created_at      TIMESTAMP
```

Sample data: 60 words across all JLPT levels

#### **UserFlashcards**
```sql
user_flashcard_id   SERIAL PRIMARY KEY
user_id             INTEGER REFERENCES Users
vocab_id            INTEGER REFERENCES Vocabulary
status              VARCHAR(20)           -- new, learning, remembered, forgotten
review_count        INTEGER DEFAULT 0
last_reviewed_at    TIMESTAMP
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **Readings** (TTL: 3 days)
```sql
reading_id          SERIAL PRIMARY KEY
user_id             INTEGER REFERENCES Users
title               VARCHAR(255) NOT NULL
content             TEXT NOT NULL         -- Japanese text
translation         TEXT                  -- Vietnamese translation
romaji_enabled      BOOLEAN DEFAULT FALSE
length              VARCHAR(20)           -- short, medium, long
genre               VARCHAR(100)          -- life, work, school, etc.
is_temporary        BOOLEAN DEFAULT TRUE  -- Auto-cleanup
expires_at          TIMESTAMP             -- Expiration time
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jpmaster

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# CORS
FRONTEND_URL=http://localhost:5173
```

3. **Setup database**
```bash
# Create PostgreSQL database
createdb jpmaster

# Run migrations
npm run migrate
```

4. **Start server**
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs on: http://localhost:3000

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| GET | `/me` | Get current user | ✅ |

**Example: Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response:
```json
{
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

---

### Flashcards (`/api/flashcards`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/progress/:level` | Get user progress by JLPT level | ✅ |
| POST | `/save-progress` | Save flashcard progress | ✅ |

**Example: Get Progress**
```bash
curl http://localhost:3000/api/flashcards/progress/N5 \
  -H "Cookie: token=your-jwt-token"
```

Response:
```json
{
  "level": "N5",
  "total": 10,
  "new": 3,
  "learning": 4,
  "remembered": 2,
  "forgotten": 1,
  "progress": 60,
  "flashcards": [...]
}
```

---

### Reading Generation (`/api/readings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/generate` | Generate AI reading | ✅ |
| GET | `/:id` | Get reading by ID | ✅ |
| POST | `/:id/quiz` | Generate quiz for reading | ✅ |
| POST | `/:id/tts` | Generate audio for reading | ✅ |

**Example: Generate Reading**
```bash
curl -X POST http://localhost:3000/api/readings/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-jwt-token" \
  -d '{
    "vocab_ids": [1, 2, 3],
    "genre": "life",
    "length": "medium",
    "level": "N5"
  }'
```

Response:
```json
{
  "reading": {
    "reading_id": 123,
    "title": "日常の生活",
    "content": "...",
    "translation": "...",
    "romaji_enabled": false
  },
  "vocab": [...]
}
```

---

## 🏗️ Architecture

### Service Layer Pattern

```
Controller → Service → Database/External API
```

**Benefits:**
- Separation of concerns
- Easy testing (mock services)
- Reusable logic
- Clean code structure

### Services Breakdown

#### **AIService** (`aiService.js`)
- Common AI operations
- Gemini API wrapper
- JSON parsing utilities

```javascript
callGemini(prompt)        // Call Gemini API
parseJsonSafe(text)       // Parse JSON response
```

#### **TextGenerationService** (`textGenerationService.js`)
- Reading text generation
- Vocabulary fetching
- Database persistence

```javascript
generateReading(vocabs, level, genre, length)
saveReadingToDB(userId, title, content, ...)
getReadingById(readingId, userId)
```

#### **AudioService** (`audioService.js`)
- Text-to-Speech generation
- Audio chunking for long text

```javascript
generateTTS(text)  // Returns {mime, audioBase64}
```

#### **QuizService** (`quizService.js`)
- Quiz generation from reading
- Question validation

```javascript
generateQuiz(reading, count)
validateQuizPayload(body)
```

#### **FlashcardService** (`flashcardService.js`)
- Progress tracking
- Statistics calculation

```javascript
getUserProgressByLevel(userId, level)
saveUserProgress(userId, vocabId, status)
```

#### **AuthService** (`authService.js`)
- User registration
- Password validation

```javascript
signup(username, email, password, fullName)
validateCredentials(email, password)
```

---

## 🤖 AI Integration

### Google Gemini API

**Model:** `gemini-2.5-flash` (configurable)

**Use Cases:**
1. **Reading Generation**
   - Input: Vocabulary words, JLPT level, genre, length
   - Output: Japanese text with translation and romaji

2. **Quiz Generation**
   - Input: Reading content
   - Output: Multiple-choice questions in Japanese

**Prompt Engineering:**
- Structured JSON responses
- Forced vocabulary inclusion
- Natural language generation
- Vietnamese translations

**Safety Settings:**
```javascript
safetySettings: [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  // ... educational content exemptions
]
```

---

## 🔐 Authentication Flow

1. **Signup/Login** → JWT token generated
2. Token stored in **HTTP-only cookie**
3. Client sends cookie with each request
4. Middleware verifies token
5. `req.user` populated with user data

**JWT Payload:**
```javascript
{
  user_id: 1,
  username: "john_doe",
  email: "user@example.com"
}
```

---

## 🗃️ Database Migrations

### Migration System

Located in `migrations/` folder:

```
001_create_migrations_table.sql    # Migration tracking
002_create_complete_schema.sql     # Users, Vocabulary, UserFlashcards
003_insert_sample_vocabulary.sql   # 60 sample words
004_cleanup_unused_tables.sql      # Remove old tables
005_add_readings_table.sql         # Readings table
```

### Run Migrations

```bash
npm run migrate
```

**Migration tracking:**
- Stored in `migrations_history` table
- Auto-skips already run migrations
- Sequential execution

---

## ⚙️ Configuration

### Environment Variables

```env
# Required
DATABASE_URL         # PostgreSQL connection string
JWT_SECRET          # Secret key for JWT
GEMINI_API_KEY      # Google AI API key

# Optional
PORT=3000           # Server port
NODE_ENV=development
JWT_EXPIRES_IN=7d
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
```

### CORS Settings

```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true  // Allow cookies
})
```

---

## 🧹 Auto-Cleanup

### Reading Expiration

**TTL:** 3 days (configurable in `textGenerationService.js`)

```javascript
const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
```

**Cleanup Job:**
- Runs every 1 hour
- Deletes expired readings (`is_temporary = TRUE` and `expires_at < NOW()`)

To change cleanup interval:
```javascript
// textGenerationService.js, line ~23
setInterval(async () => {
  await this.cleanupExpiredReadings()
}, 3600000) // 1 hour = 3600000ms
```

---

## 🐛 Error Handling

### Standard Error Response

```json
{
  "error": "Error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 502 | Bad Gateway (AI API error) |

---

## 🧪 Testing

### Manual Testing

Use Postman, Insomnia, or curl:

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Future: Automated Testing
- Jest for unit tests
- Supertest for API tests
- Test database setup

---

## 📊 Performance

### Optimization Tips

1. **Database Indexing**
   - Indexes on frequently queried columns
   - See `query.sql` for index definitions

2. **Connection Pooling**
   - PostgreSQL pool configuration
   - Max connections: 20

3. **Caching** (Future)
   - Redis for reading cache
   - Vocabulary cache in memory

---

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens in HTTP-only cookies
- ✅ CORS configured for specific origin
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation in controllers
- ⚠️ Rate limiting (TODO)
- ⚠️ API key rotation (TODO)

---

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)
- [Google Gemini API](https://ai.google.dev/docs)
- [JWT Best Practices](https://jwt.io/introduction)

---

## 🤝 Contributing

### Code Style

- ES6+ syntax (async/await, arrow functions)
- ES Modules (`import/export`)
- Services should be stateless
- Controllers handle HTTP only
- Use meaningful variable names

### Adding New Features

1. Create service in `services/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Update `index.js` to register routes
5. Add migration if DB changes needed

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ JWT authentication
- ✅ Flashcard system with progress tracking
- ✅ AI reading generation (Gemini)
- ✅ Quiz generation
- ✅ TTS generation (Google TTS)
- ✅ Auto-cleanup for temporary readings

---

## 📧 Support

For backend-specific issues:
- Check server logs (`console.log`)
- Verify database connection
- Test API endpoints with curl/Postman
- Review environment variables
