# BÁO CÁO CÔNG NGHỆ SỬ DỤNG - JP-MASTER

---

## FRONTEND

### 1. React 19.2
**Vai trò:** Framework chính để xây dựng giao diện người dùng

**Lý do chọn:**
- Component-based architecture giúp tái sử dụng code hiệu quả
- Virtual DOM tối ưu hiệu năng render
- Hệ sinh thái phong phú với nhiều thư viện hỗ trợ
- Phiên bản mới nhất với các tính năng hiện đại

**Ứng dụng trong dự án:**
- Xây dựng các component flashcard với hiệu ứng flip 3D
- Quản lý state cho tiến độ học tập
- Render động nội dung bài đọc và quiz từ AI

---

### 2. Vite 7.2
**Vai trò:** Build tool và development server

**Lý do chọn:**
- Hot Module Replacement (HMR) cực nhanh - cải thiện trải nghiệm phát triển
- Build time nhanh hơn Webpack đáng kể
- Cấu hình đơn giản, out-of-the-box
- Hỗ trợ ES modules native

**Ứng dụng trong dự án:**
- Development server với instant reload
- Optimize bundle size cho production
- Code splitting tự động

---

### 3. Tailwind CSS 3.4
**Vai trò:** CSS framework cho styling

**Lý do chọn:**
- Utility-first approach giúp phát triển UI nhanh
- Responsive design dễ dàng với breakpoints có sẵn
- File size nhỏ (purge unused CSS)
- Consistency trong design system

**Ứng dụng trong dự án:**
- Responsive layout cho mobile và desktop
- Animations và transitions cho flashcard
- Theme system với custom colors
- Gradient backgrounds và effects

---

### 4. React Router 6
**Vai trò:** Routing library

**Lý do chọn:**
- Client-side routing giúp SPA hoạt động mượt mà
- Protected routes cho authentication
- Nested routing cho cấu trúc phức tạp

**Ứng dụng trong dự án:**
- Navigation giữa các trang (Home, Flashcard, Reading, Login)
- Route protection (yêu cầu đăng nhập)
- Dynamic routing với params (flashcard/:level, readings/:id)

---

## BACKEND

### 1. Node.js + Express 5
**Vai trò:** Runtime và web framework cho REST API

**Lý do chọn:**
- JavaScript full-stack (cùng ngôn ngữ với frontend)
- Non-blocking I/O phù hợp cho ứng dụng real-time
- Express mature và có nhiều middleware
- Performance cao với V8 engine

**Ứng dụng trong dự án:**
- REST API endpoints cho flashcard, reading, quiz, audio
- Middleware cho authentication và error handling
- Route organization theo modules
- Async/await pattern cho database và AI calls

---

### 2. PostgreSQL
**Vai trò:** Relational database

**Lý do chọn:**
- ACID compliance đảm bảo tính toàn vẹn dữ liệu
- Hỗ trợ complex queries và joins
- Full-text search cho từ vựng
- Reliable và production-ready

**Ứng dụng trong dự án:**
- Lưu trữ users, vocabulary, flashcard progress
- Foreign key constraints đảm bảo referential integrity
- Indexing cho performance (user_id, vocab_id, level)
- Timestamp tracking cho tiến độ học tập

**Schema chính:**
```
Users (authentication)
Vocabulary (60+ words, N5-N1)
UserFlashcards (progress tracking)
Readings (temporary storage, TTL 3 days)
```

---

### 3. JWT (JSON Web Token)
**Vai trò:** Authentication mechanism

**Lý do chọn:**
- Stateless authentication (không cần session storage)
- Secure với signature verification
- HTTP-only cookies chống XSS attacks
- Scalable cho multiple servers

**Ứng dụng trong dự án:**
- User login/signup với token generation
- Token verification middleware cho protected routes
- Expire time 7 ngày
- Payload chứa user_id, username, email

---

### 4. Google Gemini AI (gemini-2.5-flash)
**Vai trò:** AI text generation engine

**Lý do chọn:**
- Free tier generous cho development
- Multilingual support tốt (Japanese ↔ Vietnamese)
- JSON mode cho structured output
- Fast response time với flash model

**Ứng dụng trong dự án:**

**Reading Generation:**
- Input: Vocabulary words, JLPT level, genre, length
- Output: Japanese text, Vietnamese translation, romaji
- Forced vocabulary inclusion với validation

**Quiz Generation:**
- Input: Reading content
- Output: Multiple-choice questions (4 options)
- Questions in Japanese, explanations in Vietnamese
- Difficulty levels: easy/medium/hard

**Prompt Engineering:**
- Structured prompts với JSON schema
- Safety settings cho educational content
- Retry logic khi parse error

---

### 5. Google Text-to-Speech (TTS)
**Vai trò:** Audio generation từ Japanese text

**Lý do chọn:**
- Quality cao cho Japanese pronunciation
- Free API không giới hạn request
- Hỗ trợ long text với chunking

**Ứng dụng trong dự án:**
- Convert reading content thành audio
- Base64 encoding cho streaming
- Auto-split text nếu > 200 characters
- MP3 format output

---

## KIẾN TRÚC TỔNG QUAN

### Service Layer Pattern
```
Client → Controller → Service → Database/External API
```

**Lợi ích:**
- Separation of concerns
- Easy testing (mock services)
- Reusable business logic
- Maintainable codebase

### Services Module:
- **AIService**: Gemini API wrapper
- **TextGenerationService**: Reading generation + DB
- **AudioService**: TTS generation
- **QuizService**: Quiz generation
- **FlashcardService**: Progress tracking
- **AuthService**: Authentication logic

---

## BẢO MẬT

1. **Password Hashing**: bcryptjs với salt rounds 10
2. **JWT Tokens**: HTTP-only cookies chống XSS
3. **CORS**: Configured cho specific origin
4. **SQL Injection Prevention**: Parameterized queries
5. **Input Validation**: Controller layer

---

## TỐI ƯU HÓA

### Frontend:
- Code splitting với dynamic imports
- Lazy loading cho routes
- Memoization với React hooks
- Tailwind CSS purging

### Backend:
- Database connection pooling
- Indexing trên frequently-queried columns
- Auto-cleanup cho temporary data (readings)
- Async/await cho non-blocking operations

---

## FLOW CÁC CHỨC NĂNG

### 1. AUTHENTICATION FLOW

#### Đăng ký (Signup)
```
[Frontend]                      [Backend]                    [Database]
    |                               |                            |
    | POST /api/auth/signup         |                            |
    |------------------------------>|                            |
    |  {username, email,            |                            |
    |   password, fullName}         |                            |
    |                               |                            |
    |                               | 1. Validate input          |
    |                               | 2. Check email exists      |
    |                               |--------------------------->|
    |                               |<---------------------------|
    |                               |                            |
    |                               | 3. Hash password (bcrypt)  |
    |                               | 4. INSERT INTO Users       |
    |                               |--------------------------->|
    |                               |<---------------------------|
    |                               | 5. Generate JWT token      |
    |                               | 6. Set HTTP-only cookie    |
    |<------------------------------|                            |
    | {user: {...}}                 |                            |
    |                               |                            |
    | 7. Redirect to /flashcard/N5  |                            |
```

#### Đăng nhập (Login)
```
[Frontend]                      [Backend]                    [Database]
    |                               |                            |
    | POST /api/auth/login          |                            |
    |------------------------------>|                            |
    |  {email, password}            |                            |
    |                               |                            |
    |                               | 1. Find user by email      |
    |                               |--------------------------->|
    |                               |<---------------------------|
    |                               | 2. Compare password hash   |
    |                               |    (bcrypt.compare)        |
    |                               | 3. Generate JWT token      |
    |                               | 4. Set cookie              |
    |<------------------------------|                            |
    | {user: {...}}                 |                            |
```

**Mô tả chi tiết:**

Khi người dùng đăng ký tài khoản mới, frontend gửi thông tin (username, email, password, fullName) đến backend qua POST request. Backend thực hiện các bước validate: kiểm tra định dạng email, độ dài password, và query database để đảm bảo email chưa tồn tại. Nếu validation pass, password được hash bằng bcryptjs với 10 salt rounds trước khi lưu vào database. Sau khi INSERT thành công, backend tạo JWT token chứa user_id, username, email và set vào HTTP-only cookie. Frontend nhận response chứa thông tin user và tự động redirect đến trang flashcard.

Quy trình đăng nhập tương tự nhưng đơn giản hơn: backend tìm user bằng email, dùng bcrypt.compare() để so sánh password hash, nếu đúng thì generate JWT token mới và set cookie. Token này sẽ được gửi kèm trong mọi request sau đó để xác thực.

**Bảo mật:**
- Password hash với bcrypt (salt rounds: 10)
- JWT token stored in HTTP-only cookie (chống XSS)
- Token expires sau 7 ngày
- Cookie secure flag trong production

---

### 2. FLASHCARD LEARNING FLOW

#### Xem tiến độ theo level
```
[Frontend]                      [Backend]                    [Database]
    |                               |                            |
    | 1. Navigate to /flashcard/N5  |                            |
    |                               |                            |
    | GET /api/flashcards           |                            |
    |   /progress/N5                |                            |
    |------------------------------>|                            |
    | Header: Cookie (JWT)          |                            |
    |                               |                            |
    |                               | 2. Verify JWT token        |
    |                               | 3. Extract user_id         |
    |                               |                            |
    |                               | 4. Query flashcards:       |
    |                               |   JOIN UserFlashcards      |
    |                               |   WITH Vocabulary          |
    |                               |   WHERE level = 'N5'       |
    |                               |--------------------------->|
    |                               |<---------------------------|
    |                               |                            |
    |                               | 5. Calculate statistics:   |
    |                               |   - Total cards            |
    |                               |   - New/Learning/          |
    |                               |     Remembered/Forgotten   |
    |                               |   - Progress %             |
    |<------------------------------|                            |
    | {level, total, new,           |                            |
    |  learning, remembered,        |                            |
    |  forgotten, progress,         |                            |
    |  flashcards: [...]}           |                            |
    |                               |                            |
    | 6. Render flashcards          |                            |
    |    with 3D flip animation     |                            |
```

#### Cập nhật trạng thái flashcard
```
[Frontend]                      [Backend]                    [Database]
    |                               |                            |
    | 1. User clicks                |                            |
    |    "Remember" button          |                            |
    |                               |                            |
    | POST /api/flashcards/         |                            |
    |   save-progress               |                            |
    |------------------------------>|                            |
    |  {vocab_id: 3,                |                            |
    |   status: "remembered"}       |                            |
    |                               |                            |
    |                               | 2. UPSERT UserFlashcards:  |
    |                               |   - Increment review_count |
    |                               |   - Update status          |
    |                               |   - Set last_reviewed_at   |
    |                               |--------------------------->|
    |                               |<---------------------------|
    |<------------------------------|                            |
    | {success: true,               |                            |
    |  updated: {...}}              |                            |
    |                               |                            |
    | 3. Update local state         |                            |
    | 4. Re-calculate progress      |                            |
```

    | 4. Re-calculate progress      |                            |
```

**Mô tả chi tiết:**

Khi người dùng truy cập vào trang flashcard với level cụ thể (ví dụ /flashcard/N5), frontend gửi request GET kèm JWT cookie. Backend middleware verify token để lấy user_id, sau đó thực hiện complex query JOIN giữa bảng UserFlashcards và Vocabulary để lấy tất cả từ vựng thuộc level đó cùng với trạng thái học tập của user.

Service layer tính toán các thống kê: tổng số thẻ, số thẻ mới (chưa học), đang học, đã nhớ, đã quên, và phần trăm tiến độ. Frontend nhận data và render flashcards dưới dạng book interface với hiệu ứng flip 3D khi click.

Khi user đánh dấu một thẻ (ví dụ click nút "Remember"), frontend gửi POST request với vocab_id và status mới. Backend thực hiện UPSERT vào bảng UserFlashcards: tăng review_count, update status, và ghi nhận last_reviewed_at. Frontend cập nhật local state để UI phản ánh ngay lập tức mà không cần reload page.

**Logic trạng thái:**
- **new** → Lần đầu hiển thị
- **learning** → Đang học (review < 3)
- **remembered** → Đã nhớ (review ≥ 3)
- **forgotten** → Click "Forgot"

---

### 3. READING GENERATION FLOW

```
[Frontend]                      [Backend]                    [Gemini AI]        [Database]
    |                               |                            |                   |
    | 1. User fills form:           |                            |                   |
    |    - Select vocab (3 words)   |                            |                   |
    |    - Choose genre (life)      |                            |                   |
    |    - Select length (medium)   |                            |                   |
    |    - Pick level (N5)          |                            |                   |
    |                               |                            |                   |
    | POST /api/readings/generate   |                            |                   |
    |------------------------------>|                            |                   |
    |  {vocab_ids: [1,2,3],         |                            |                   |
    |   genre: "life",              |                            |                   |
    |   length: "medium",           |                            |                   |
    |   level: "N5"}                |                            |                   |
    |                               |                            |                   |
    |                               | 2. Validate input          |                   |
    |                               |                            |                   |
    |                               | 3. Get vocabulary          |                   |
    |                               |--------------------------->|------------------>|
    |                               |<---------------------------|<------------------|
    |                               | [{word, kana, meaning}]    |                   |
    |                               |                            |                   |
    |                               | 4. Build prompt:           |                   |
    |                               |   "Viết bài đọc tiếng Nhật|                   |
    |                               |    ~150-220 chữ,           |                   |
    |                               |    thể loại life,          |                   |
    |                               |    chứa: 水,火,山          |                   |
    |                               |    Return JSON:            |                   |
    |                               |    {title, content,        |                   |
    |                               |     translation, romaji}"  |                   |
    |                               |                            |                   |
    |                               | 5. Call Gemini API         |                   |
    |                               |--------------------------->|                   |
    |                               |                            | 6. Generate text  |
    |                               |                            |    (2-5 seconds)  |
    |                               |<---------------------------|                   |
    |                               | Raw JSON string            |                   |
    |                               |                            |                   |
    |                               | 7. Parse JSON              |                   |
    |                               | 8. Validate words included |                   |
    |                               |                            |                   |
    |                               | 9. Save to DB:             |                   |
    |                               |    INSERT INTO Readings    |                   |
    |                               |    (TTL: 3 days)           |                   |
    |                               |--------------------------->|------------------>|
    |                               |<---------------------------|<------------------|
    |<------------------------------|                            |                   |
    | {reading: {                   |                            |                   |
    |   reading_id: 123,            |                            |                   |
    |   title: "日常の生活",          |                            |                   |
    |   content: "...",             |                            |                   |
    |   translation: "...",         |                            |                   |
    |   romaji: "..."               |                            |                   |
    |  },                           |                            |                   |
    |  vocab: [...]}                |                            |                   |
    |                               |                            |                   |
    | 10. Display reading           |                            |                   |
    | 11. Show vocab list           |                            |                   |
```

    | 11. Show vocab list           |                            |                   |
```

**Mô tả chi tiết:**

Đây là flow phức tạp nhất trong hệ thống. User điền form chọn 3 từ vựng từ dropdown, chọn thể loại (life, work, school...), độ dài (short/medium/long), và JLPT level. Frontend validate input trước khi gửi POST request.

Backend nhận request và thực hiện các bước: (1) Query database lấy thông tin đầy đủ của 3 từ vựng (word, kana, meaning), (2) Xây dựng prompt chi tiết cho Gemini AI bao gồm yêu cầu độ dài (~150-220 chữ cho medium), thể loại, level, và QUAN TRỌNG nhất là bắt buộc phải chứa cả 3 từ đã chọn trong đúng hình thức kanji/kana.

Prompt được gửi đến Gemini API, AI xử lý trong 2-5 giây và trả về JSON string chứa: title (tiếng Nhật), content (bài đọc tiếng Nhật), translation (tiếng Việt), và romaji (optional). Backend parse JSON, validate xem 3 từ có xuất hiện trong content không (dùng string.includes), nếu pass thì INSERT vào bảng Readings với expires_at = hiện tại + 3 ngày.

Frontend nhận reading object với reading_id và hiển thị bài đọc kèm danh sách vocabulary đã dùng. User có thể toggle giữa hiển thị translation và romaji.

**Đặc điểm:**
- AI generate trong 2-5 giây
- Validation: Bắt buộc chứa tất cả từ vựng đã chọn
- Lưu temporary vào DB (expires_at = now + 3 days)
- Auto-cleanup job chạy mỗi 1 giờ

---

### 4. QUIZ GENERATION FLOW

```
[Frontend]                      [Backend]                    [Gemini AI]        [Database]
    |                               |                            |                   |
    | 1. User clicks "Generate Quiz"|                            |                   |
    |    on reading #123            |                            |                   |
    |                               |                            |                   |
    | POST /api/readings/123/quiz   |                            |                   |
    |------------------------------>|                            |                   |
    |  {count: 3}                   |                            |                   |
    |                               |                            |                   |
    |                               | 2. Get reading from DB     |                   |
    |                               |--------------------------->|------------------>|
    |                               |<---------------------------|<------------------|
    |                               | {reading_id, content,      |                   |
    |                               |  translation}              |                   |
    |                               |                            |                   |
    |                               | 3. Build quiz prompt:      |                   |
    |                               |   "Tạo 3 câu hỏi trắc     |                   |
    |                               |    nghiệm từ bài đọc:      |                   |
    |                               |    [content]               |                   |
    |                               |    Questions in Japanese   |                   |
    |                               |    Return JSON: {          |                   |
    |                               |     questions: [{          |                   |
    |                               |      question, options,    |                   |
    |                               |      answer, explanation,  |                   |
    |                               |      difficulty }]}"       |                   |
    |                               |                            |                   |
    |                               | 4. Call Gemini API         |                   |
    |                               |--------------------------->|                   |
    |                               |                            | 5. Generate quiz  |
    |                               |<---------------------------|                   |
    |                               | Raw JSON                   |                   |
    |                               |                            |                   |
    |                               | 6. Parse JSON              |                   |
    |                               | 7. Validate schema:        |                   |
    |                               |    - 4 options per Q       |                   |
    |                               |    - Answer in options     |                   |
    |                               |    - Has explanation       |                   |
    |<------------------------------|                            |                   |
    | {quiz: {                      |                            |                   |
    |   questions: [                |                            |                   |
    |    {id: "q1",                 |                            |                   |
    |     question: "これは何ですか？", |                            |                   |
    |     options: [...],           |                            |                   |
    |     answer: "...",            |                            |                   |
    |     explanation: "...",       |                            |                   |
    |     difficulty: "easy"        |                            |                   |
    |    }]}}                       |                            |                   |
    |                               |                            |                   |
    | 8. Display quiz UI            |                            |                   |
    | 9. User selects answers       |                            |                   |
    | 10. Show results (frontend)   |                            |                   |
```

    | 10. Show results (frontend)   |                            |                   |
```

**Mô tả chi tiết:**

Sau khi user đã có bài đọc, họ có thể click nút "Generate Quiz" để tạo câu hỏi trắc nghiệm. Frontend gửi reading_id và số lượng câu hỏi mong muốn (mặc định 3, tối đa 6).

Backend query database lấy reading content và translation. Dữ liệu này được đưa vào prompt template đặc biệt: yêu cầu AI tạo câu hỏi ĐỌC HIỂU dựa trên nội dung, mỗi câu có 4 đáp án, câu hỏi và đáp án phải bằng tiếng Nhật (không được dùng tiếng Việt), nhưng phần explanation (giải thích tại sao đúng) thì viết bằng tiếng Việt để học viên dễ hiểu.

AI generate quiz trong 2-3 giây, trả về JSON array chứa questions. Backend validate schema chặt chẽ: mỗi câu phải có đúng 4 options, answer phải match một trong 4 options, có explanation và difficulty level. Nếu validation fail, trả error 502 kèm raw response để debug.

Frontend nhận quiz và render UI: hiển thị từng câu hỏi, 4 radio buttons cho options, user select và submit. Hiện tại scoring được tính ở frontend (chưa lưu vào DB), hiển thị kết quả và explanation sau khi hoàn thành.

**Validation:**
- Mỗi câu hỏi phải có đủ 4 options
- Answer phải match một trong các options
- Question và options bằng tiếng Nhật
- Explanation bằng tiếng Việt

---

### 5. AUDIO GENERATION FLOW (TTS)

```
[Frontend]                      [Backend]                    [Google TTS]       [Database]
    |                               |                            |                   |
    | 1. User clicks "Play Audio"   |                            |                   |
    |    for reading #123           |                            |                   |
    |                               |                            |                   |
    | POST /api/readings/123/tts    |                            |                   |
    |------------------------------>|                            |                   |
    |                               |                            |                   |
    |                               | 2. Get reading from DB     |                   |
    |                               |--------------------------->|------------------>|
    |                               |<---------------------------|<------------------|
    |                               | {content: "日本語テキスト"}  |                   |
    |                               |                            |                   |
    |                               | 3. Check text length       |                   |
    |                               |    If ≤200 chars:          |                   |
    |                               |                            |                   |
    |                               | 4a. Call TTS (single)      |                   |
    |                               |--------------------------->|                   |
    |                               |                            | 5a. Generate audio|
    |                               |<---------------------------|                   |
    |                               | base64 audio               |                   |
    |                               |                            |                   |
    |                               |    If >200 chars:          |                   |
    |                               |                            |                   |
    |                               | 4b. Split into chunks      |                   |
    |                               | 5b. Call TTS (multiple)    |                   |
    |                               |--------------------------->|                   |
    |                               |                            | 6b. Generate parts|
    |                               |<---------------------------|                   |
    |                               | [base64_1, base64_2, ...]  |                   |
    |                               |                            |                   |
    |                               | 7. Merge audio chunks      |                   |
    |                               | 8. Encode to base64        |                   |
    |<------------------------------|                            |                   |
    | {mime: "audio/mpeg",          |                            |                   |
    |  audioBase64: "..."}          |                            |                   |
    |                               |                            |                   |
    | 9. Decode base64              |                            |                   |
    | 10. Create audio element      |                            |                   |
    | 11. Play audio                |                            |                   |
```

    | 11. Play audio                |                            |                   |
```

**Mô tả chi tiết:**

Chức năng Text-to-Speech cho phép user nghe phát âm tiếng Nhật chuẩn của bài đọc. Khi click nút "Play Audio", frontend gửi reading_id đến backend.

Backend query database lấy content (text tiếng Nhật), sau đó kiểm tra độ dài. Nếu text ≤ 200 ký tự, gọi Google TTS API một lần duy nhất và nhận về base64 audio. Nếu text > 200 ký tự (trường hợp bài dài), backend tự động split text thành các chunks nhỏ hơn, gọi TTS API cho từng chunk song song, nhận về array of base64 strings.

Các audio chunks được merge lại bằng cách convert base64 → Buffer → concat buffers → convert lại base64. Audio final được trả về frontend dưới format {mime: "audio/mpeg", audioBase64: "..."}.

Frontend decode base64, tạo Blob, tạo object URL, gán vào HTML5 <audio> element và play. User có thể pause/play/seek như media player thông thường.

**Đặc điểm:**
- Free API (không giới hạn)
- Auto-split cho text dài
- Japanese native pronunciation
- MP3 format
- Base64 encoding cho transmission

---

### 6. AUTO-CLEANUP FLOW (Background Job)

```
[Backend Service]               [Database]
    |                               |
    | Cron job runs every 1 hour    |
    |                               |
    | 1. Query expired readings:    |
    |    SELECT * FROM Readings     |
    |    WHERE is_temporary = TRUE  |
    |    AND expires_at < NOW()     |
    |------------------------------>|
    |<------------------------------|
    | [reading_id: 45, 67, 89]      |
    |                               |
    | 2. DELETE FROM Readings       |
    |    WHERE reading_id IN (...)  |
    |------------------------------>|
    |<------------------------------|
    | Deleted 3 rows                |
    |                               |
    | 3. Log cleanup result         |
```

    | 3. Log cleanup result         |
```

**Mô tả chi tiết:**

Để tránh database bị đầy với các bài đọc tạm thời, hệ thống có background job tự động dọn dẹp. Khi ReadingService khởi tạo (server start), nó setup một setInterval chạy mỗi 1 giờ (3600000ms).

Mỗi lần job chạy, nó thực hiện query DELETE tất cả readings có is_temporary = TRUE và expires_at < NOW(). PostgreSQL tự động tính toán điều kiện timestamp. Ví dụ: nếu reading được tạo lúc 10:00 ngày 1/1 với TTL 3 ngày, expires_at sẽ là 10:00 ngày 4/1. Job chạy sau 10:00 ngày 4/1 sẽ xóa record này.

Số lượng rows deleted được log ra console để admin monitor. Job chạy im lặng trong background, không ảnh hưởng đến API performance. Nếu server restart, job sẽ setup lại và tiếp tục chu kỳ.

**Cấu hình:**
- Cleanup interval: 1 giờ (3600000ms)
- TTL: 3 ngày (configurable)
- Only delete `is_temporary = TRUE`

---

### 7. DATA FLOW TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   [Flashcard]  [Reading]    [Quiz/Audio]
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   React Frontend      │
         │   - Components        │
         │   - State Management  │
         │   - API Client        │
         └───────────┬───────────┘
                     │ HTTP Request
                     │ (JSON + JWT Cookie)
                     ▼
         ┌───────────────────────┐
         │   Express Backend     │
         │   - Routes            │
         │   - Auth Middleware   │
         │   - Controllers       │
         └───────────┬───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐  ┌────────┐  ┌──────────┐
   │Services │  │Gemini  │  │Google TTS│
   │- Text   │  │   AI   │  │          │
   │- Audio  │  └────────┘  └──────────┘
   │- Quiz   │
   │- Auth   │
   └────┬────┘
        │
        ▼
   ┌──────────────┐
   │  PostgreSQL  │
   │  - Users     │
   │  - Vocab     │
   │  - Flashcard │
   │  - Readings  │
   └──────────────┘
```

   └──────────────┘
```

**Mô tả tổng quan:**

Kiến trúc hệ thống tuân theo mô hình 3-tier cổ điển với các layers tách biệt rõ ràng:

**Presentation Layer (Frontend):** React application chạy trên browser, chịu trách nhiệm hiển thị UI, handle user interactions, manage local state, và gọi API. Components được tổ chức theo atomic design pattern với reusable parts.

**Application Layer (Backend):** Express server đóng vai trò API gateway, nhận requests từ frontend, verify authentication qua JWT middleware, route đến controllers tương ứng. Controllers orchestrate business logic bằng cách gọi services.

**Service Layer:** Là nơi chứa toàn bộ business logic. Mỗi service có trách nhiệm riêng: AIService wrap Gemini API, TextGenerationService handle reading creation, QuizService generate questions, AudioService call TTS. Pattern này giúp code dễ test (mock services) và maintain.

**Data Layer:** PostgreSQL database lưu trữ persistent data với schema normalized, có indexes trên các foreign keys và frequently-queried columns. External APIs (Gemini, Google TTS) được treat như data sources khác.

**Communication:** Frontend-backend dùng REST API với JSON payload. Authentication dùng JWT trong HTTP-only cookie (stateless, secure). Backend-database dùng connection pool để optimize performance. Backend-AI services dùng HTTP requests với API keys.

**Flow điển hình:** User interaction → React component → API call (with JWT) → Express middleware (auth check) → Controller → Service (business logic) → Database/External API → Response chain ngược lại → UI update.

---

## BÁO CÁO KIẾN TRÚC TỔNG QUAN

### 1. Mục tiêu kiến trúc
- Tách lớp rõ ràng (presentation ↔ application ↔ service ↔ data) để dễ bảo trì, mở rộng và kiểm thử.
- Cho phép thay thế/ mở rộng AI providers (Gemini, TTS) mà không ảnh hưởng controller.
- Đảm bảo bảo mật cơ bản: JWT, cookie HTTP-only, truy vấn có tham số, phân quyền qua middleware.

### 2. Frontend (React + Vite)
- SPA dùng React 19, router client-side, trạng thái cục bộ qua hooks; cấu trúc component hóa (pages/components/utils).
- Tailwind CSS cho responsive UI, tối ưu bundle nhờ Vite và purge CSS.
- API client trung gian (apiClient.js) đóng gói endpoint, đính kèm JWT cookie tự động.
- Routing: Home, About, Features, Flashcard theo level, Reading generate, Auth pages.

### 3. Backend (Express 5)
- Layered: Router → Middleware (auth) → Controller → Service → DB/External API.
- Controllers mỏng, chỉ xử lý I/O và validation nhẹ; logic nằm ở services.
- Service tách biệt: AIService (Gemini), TextGenerationService, QuizService, AudioService, FlashcardService, AuthService, TokenService.
- Middleware: auth.js kiểm JWT, gắn req.user; cors, cookie-parser cho bảo mật và tiện dụng.

### 4. Data Layer (PostgreSQL)
- Schema chính: Users, Vocabulary, UserFlashcards, Readings (TTL 3 ngày).
- Ràng buộc FK, index trên user_id, vocab_id, level, expires_at để tối ưu truy vấn.
- Migrations tuần tự, có bảng migrations_history để tracking.

### 5. AI & External Services
- Gemini (gemini-2.5-flash): tạo bài đọc, tạo quiz; prompt có schema JSON bắt buộc, kiểm tra lại ở backend.
- Google TTS: sinh audio MP3, hỗ trợ chia nhỏ đoạn dài, merge và trả base64.
- Tất cả API call nằm trong service riêng, dễ thay thế hoặc mock khi test.

### 6. Authentication & Security
- JWT lưu trong HTTP-only cookie (giảm XSS), expirations 7 ngày.
- Password hash bằng bcrypt (salt 10).
- CORS giới hạn origin, dùng cookie-parser.
- Query có tham số để chống SQL Injection; input validation tại controller.

### 7. Observability & Ops (cơ bản)
- Logging lỗi tại controller/service (console) — có thể nâng cấp sang Winston/Datadog sau.
- Cron nhẹ trong service để dọn Readings hết hạn mỗi 1 giờ.
- Có sẵn cấu hình Docker mẫu trong backend README (optional).

### 8. Tính mở rộng tương lai
- Thêm caching (Redis) cho readings/quiz để giảm latency AI.
- Tách service thành microservice nếu cần (AI worker riêng, API gateway giữ auth).
- Bổ sung rate limiting, audit log, metrics (Prometheus) khi lên production.

## KẾT LUẬN

Quá trình phát triển JP-Master đã hoàn thành mục tiêu xây dựng một ứng dụng học tiếng Nhật tích hợp AI. Hệ thống cho phép người dùng học từ vựng qua flashcard, sinh bài đọc tự động dựa trên từ vựng đã chọn, tạo quiz để kiểm tra hiểu biết, và nghe phát âm chuẩn qua tính năng text-to-speech. Kiến trúc của ứng dụng được thiết kế theo mô hình lớp rõ ràng: frontend React giao tiếp với backend Express qua REST API, backend sử dụng các dịch vụ AI (Gemini cho văn bản, Google TTS cho âm thanh) để tạo nội dung động, và toàn bộ dữ liệu người dùng cùng lịch sử học tập được lưu an toàn trong PostgreSQL. Các dữ liệu tạm sinh ra bởi AI (như bài đọc) được lưu với thời hạn 3 ngày rồi tự động xóa, giúp tiết kiệm bộ nhớ và dữ liệu cơ sở.

Điểm mạnh của kiến trúc này nằm ở sự tách biệt giữa các tầng. Controllers không chứa logic phức tạp mà chỉ đóng vai trò điều phối request, các Services chứa toàn bộ logic nghiệp vụ (tạo bài đọc, sinh quiz, gọi AI...), nhờ vậy dễ dàng thay đổi hoặc mở rộng chức năng mà không ảnh hưởng đến các phần khác. Việc đóng gói các lệnh gọi AI vào các service riêng biệt giúp trong tương lai có thể dễ dàng chuyển đổi sang nhà cung cấp AI khác nếu cần thiết. Hệ thống quản lý cơ sở dữ liệu qua migrations cho phép theo dõi và kiểm soát sự thay đổi lược đồ, đồng thời các chỉ mục được thiết lập trên những cột thường xuyên được truy vấn giúp tối ưu hiệu suất.

Tuy nhiên, hệ thống còn một số hạn chế cần lưu ý. Chất lượng nội dung phụ thuộc vào đầu ra của AI, nên đôi khi cần có cơ chế bổ sung để phát hiện và sửa chữa khi AI trả về dữ liệu không đúng định dạng. Hiện tại chưa có tính năng lưu và phân tích kết quả quiz, không thể theo dõi chi tiết tiến độ học tập của người dùng. Hệ thống logging còn đơn bản, chưa có các công cụ để giám sát hoạt động chi tiết. Ngoài ra, chưa có cơ chế giới hạn tần suất yêu cầu (rate limiting) cho các endpoint quan trọng, có thể để lỗ hổng bảo mật.

Từ quá trình phát triển, có một số bài học quý báu. Thứ nhất, tách biệt rõ ràng giữa controller và service là quyết định kiến trúc sáng suốt, vì nó cho phép thay đổi cách hoạt động mà không phải chỉnh sửa nhiều file. Thứ hai, thiết kế dữ liệu tạm với thời hạn (TTL) là giải pháp hợp lý cho nội dung AI, giúp tránh cơ sở dữ liệu phình to do lưu trữ quá nhiều bài đọc không cần thiết. Thứ ba, cần validate và parse rất chặt chẽ những dữ liệu từ AI, vì không thể lúc nào cũng tin tưởng 100% vào chất lượng đầu ra. Cuối cùng, các migrations nhỏ, tuần tự và được tài liệu rõ ràng giúp việc cập nhật lược đồ cơ sở dữ liệu trở nên an toàn và dễ theo dõi.

Những bước phát triển tiếp theo nên tập trung vào tối ưu hiệu suất và nâng cao trải nghiệm người dùng. Thêm bộ nhớ cache cho những bài đọc và quiz được yêu cầu thường xuyên sẽ giảm đáng kể thời gian chờ đợi. Lưu trữ kết quả quiz và áp dụng các thuật toán học lặp lại có khoảng cách (Spaced Repetition) cho flashcard sẽ tạo nên trải nghiệm học tập hiệu quả hơn. Cũng nên tăng cường bảo mật bằng cách thêm rate limiting, logging chi tiết, và các chỉ số giám sát để phát hiện vấn đề sớm. Kiểm thử tự động ở mức độ đơn vị và tích hợp, cùng với các bài kiểm tra tải, sẽ đảm bảo ứng dụng hoạt động ổn định khi có nhiều người dùng cùng lúc. Cuối cùng, chuẩn bị kỹ lưỡng cho triển khai production (bao gồm CI/CD, môi trường staging) sẽ giúp việc phát hành phiên bản mới mềm mại và an toàn.

Tóm lại, JP-Master là một ứng dụng được xây dựng với những công nghệ hiện đại, kiến trúc sạch, và những quyết định lựa chọn hợp lý, từ đó tiết kiệm chi phí vận hành nhất là nhờ các dịch vụ AI miễn phí. Với những cải thiện về bảo mật, giám sát hệ thống, và tối ưu hiệu năng, ứng dụng hoàn toàn có thể mở rộng quy mô phục vụ hàng trăm hoặc hàng nghìn người dùng đồng thời mà vẫn duy trì ổn định và chất lượng.
