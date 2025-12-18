# JP-Master: Japanese Learning Platform

## 🎯 Tính năng đã implement

### ✅ Backend Authentication
- **Signup endpoint**: `/api/auth/signup`
  - Yêu cầu: username, email, password, fullName
  - Lưu hash password với bcryptjs
  - Trả về JWT token (7 days expiry)
  - Kiểm tra duplicate username/email

- **Login endpoint**: `/api/auth/login`
  - Yêu cầu: email, password
  - So sánh password hash
  - Trả về JWT token + user info

- **Verify token endpoint**: `/api/auth/verify`
  - Kiểm tra token validity
  - Trả về user info nếu token hợp lệ

### ✅ Frontend Authentication
- **Signup Page** (`/signup`)
  - Form đầy đủ: Full Name, Username, Email, Password, Confirm Password
  - Validation client-side
  - Error handling & success messages
  - Chuyển hướng tự động sau khi đăng ký thành công

- **Login Page** (`/login`)
  - Form: Email, Password, Remember me checkbox
  - Lưu token vào localStorage
  - Remember me functionality
  - Chuyển hướng tự động sau khi đăng nhập thành công

- **Protected Routes**
  - Login/Signup pages chỉ accessible khi chưa đăng nhập
  - Home page hiển thị Hero khi chưa đăng nhập, chỉ hiển thị Home sau khi đăng nhập
  
- **Navbar Integration**
  - Hiển thị username khi đăng nhập
  - Logout button
  - Conditional rendering Login/Signup vs Dashboard/Logout buttons

### ✅ Database
- **Users Table**
  - user_id (Serial Primary Key)
  - username (UNIQUE)
  - email (UNIQUE)
  - password_hash (bcrypt hashed)
  - full_name
  - created_at
  - updated_at

## 🚀 Setup & Testing

### 1. Database Setup
```sql
-- Chạy query.sql trong PostgreSQL Admin để tạo tables
-- Hoặc chạy từ terminal:
psql -U postgres -d JP-Master -f backend/query.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend sẽ chạy trên http://localhost:4000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend sẽ chạy trên http://localhost:5173
```

## 🧪 Testing

### Test Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Verify Token
```bash
curl -X POST http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 File Structure

```
JP-Master/
├── backend/
│   ├── src/
│   │   ├── index.js (main server file)
│   │   └── routes/
│   │       └── authRoutes.js (authentication endpoints)
│   ├── query.sql (database schema)
│   ├── .env (environment variables)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Home.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx (with auth integration)
    │   │   ├── Button.jsx (with disabled state)
    │   │   └── ...
    │   ├── App.jsx (main router with auth state)
    │   └── App.css
    └── package.json
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ CORS enabled for cross-origin requests
- ✅ Token expiry: 7 days
- ✅ Protected routes on frontend
- ✅ Environment variables for secrets

## ⚙️ Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/JP-Master
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
```

## 📝 Next Steps

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Google/GitHub OAuth integration
- [ ] User profile page
- [ ] Dashboard with learning progress
- [ ] Lesson content pages
- [ ] Quiz system integration
