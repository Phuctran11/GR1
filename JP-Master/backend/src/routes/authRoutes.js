import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Injection của pool từ index.js
export function setupAuthRoutes(app, pool) {
    // ===== SIGNUP =====
    app.post('/api/auth/signup', async (req, res) => {
        try {
            const { username, email, password, confirmPassword, fullName } = req.body

            // Validate input
            if (!email || !password || !username) {
                return res.status(400).json({ error: 'Email, username, và password là bắt buộc' })
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Mật khẩu không khớp' })
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' })
            }

            // Check if user exists
            const existingUser = await pool.query(
                'SELECT * FROM Users WHERE email = $1 OR username = $2',
                [email, username]
            )

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: 'Email hoặc username đã tồn tại' })
            }

            // Hash password
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            // Insert user
            const result = await pool.query(
                'INSERT INTO Users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email',
                [username, email, passwordHash, fullName || username]
            )

            const user = result.rows[0]

            // Create JWT token
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email, username: user.username },
                process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                { expiresIn: '7d' }
            )

            res.status(201).json({
                message: 'Đăng ký thành công!',
                token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                },
            })
        } catch (err) {
            console.error('Signup error:', err)
            res.status(500).json({ error: 'Lỗi server khi đăng ký' })
        }
    })

    // ===== LOGIN =====
    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email và password là bắt buộc' })
            }

            // Find user
            const result = await pool.query(
                'SELECT * FROM Users WHERE email = $1',
                [email]
            )

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
            }

            const user = result.rows[0]

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash)

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
            }

            // Create JWT token
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email, username: user.username },
                process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                { expiresIn: '7d' }
            )

            res.json({
                message: 'Đăng nhập thành công!',
                token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                },
            })
        } catch (err) {
            console.error('Login error:', err)
            res.status(500).json({ error: 'Lỗi server khi đăng nhập' })
        }
    })

    // ===== VERIFY TOKEN =====
    app.post('/api/auth/verify', async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]

            if (!token) {
                return res.status(401).json({ error: 'Không có token' })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
            res.json({ valid: true, user: decoded })
        } catch (err) {
            res.status(401).json({ valid: false, error: 'Token không hợp lệ' })
        }
    })

    // ===== DEBUG: GET ALL USERS (ONLY FOR TESTING) =====
    app.get('/api/auth/debug/users', async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT user_id, username, email, full_name, created_at FROM Users ORDER BY created_at DESC LIMIT 10'
            )
            res.json({
                total: result.rows.length,
                users: result.rows
            })
        } catch (err) {
            console.error('Debug users error:', err)
            res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' })
        }
    })
}

export default router
