import bcrypt from 'bcryptjs'

/**
 * Service layer for authentication operations
 */
export class AuthService {
    constructor(pool) {
        this.pool = pool
    }

    async findUserByEmail(email) {
        const result = await this.pool.query(
            'SELECT * FROM Users WHERE email = $1',
            [email]
        )
        return result.rows[0] || null
    }

    async findUserByEmailOrUsername(email, username) {
        const result = await this.pool.query(
            'SELECT * FROM Users WHERE email = $1 OR username = $2',
            [email, username]
        )
        return result.rows[0] || null
    }

    async createUser(username, email, passwordHash, fullName) {
        const result = await this.pool.query(
            'INSERT INTO Users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email',
            [username, email, passwordHash, fullName || username]
        )
        return result.rows[0]
    }

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash)
    }

    validateSignupInput(username, email, password, confirmPassword) {
        if (!email || !password || !username) {
            return 'Email, username, và password là bắt buộc'
        }
        if (password !== confirmPassword) {
            return 'Mật khẩu không khớp'
        }
        if (password.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự'
        }
        return null
    }

    validateLoginInput(email, password) {
        if (!email || !password) {
            return 'Email và password là bắt buộc'
        }
        return null
    }
}
