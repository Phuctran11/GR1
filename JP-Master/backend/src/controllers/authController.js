import { AuthService } from '../services/authService.js'
import { TokenService } from '../services/tokenService.js'

/**
 * Controller for authentication endpoints
 */
export class AuthController {
    constructor(pool) {
        this.authService = new AuthService(pool)
        this.tokenService = new TokenService()
    }

    signup = async (req, res) => {
        try {
            const { username, email, password, confirmPassword, fullName } = req.body

            const validationError = this.authService.validateSignupInput(username, email, password, confirmPassword)
            if (validationError) {
                return res.status(400).json({ error: validationError })
            }

            const existingUser = await this.authService.findUserByEmailOrUsername(email, username)
            if (existingUser) {
                return res.status(409).json({ error: 'Email hoặc username đã tồn tại' })
            }

            const passwordHash = await this.authService.hashPassword(password)
            const user = await this.authService.createUser(username, email, passwordHash, fullName)

            const token = this.tokenService.generateToken({
                user_id: user.user_id,
                username: user.username
            })

            res.cookie('token', token, this.tokenService.getCookieOptions())

            res.status(201).json({
                message: 'Đăng ký thành công!',
                user: {
                    user_id: user.user_id,
                    username: user.username,
                },
            })
        } catch (err) {
            console.error('Signup error:', err)
            res.status(500).json({ error: 'Lỗi server khi đăng ký' })
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body

            const validationError = this.authService.validateLoginInput(email, password)
            if (validationError) {
                return res.status(400).json({ error: validationError })
            }

            const user = await this.authService.findUserByEmail(email)
            if (!user) {
                return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
            }

            const isPasswordValid = await this.authService.comparePassword(password, user.password_hash)
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
            }

            const token = this.tokenService.generateToken({
                user_id: user.user_id,
                username: user.username
            })

            res.cookie('token', token, this.tokenService.getCookieOptions())

            res.json({
                message: 'Đăng nhập thành công!',
                user: {
                    user_id: user.user_id,
                    username: user.username,
                },
            })
        } catch (err) {
            console.error('Login error:', err)
            res.status(500).json({ error: 'Lỗi server khi đăng nhập' })
        }
    }

    verify = async (req, res) => {
        try {
            const token = this.tokenService.extractToken(req)
            if (!token) {
                return res.status(401).json({ error: 'Không có token' })
            }

            const decoded = this.tokenService.verifyToken(token)
            res.json({ valid: true, user: decoded })
        } catch (err) {
            res.status(401).json({ valid: false, error: 'Token không hợp lệ' })
        }
    }

    logout = async (req, res) => {
        try {
            const isProd = process.env.NODE_ENV === 'production'
            res.clearCookie('token', {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'none' : 'lax',
            })
            res.json({ ok: true })
        } catch (err) {
            console.error('Logout error:', err)
            res.status(500).json({ error: 'Lỗi server khi logout' })
        }
    }
}
