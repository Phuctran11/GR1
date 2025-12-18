import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

/**
 * Sign Up Page
 */
export default function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        termsAgreed: false,
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validate
        if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
            setError('Vui lòng điền tất cả các trường')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp')
            return
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        if (!formData.termsAgreed) {
            setError('Bạn phải đồng ý với Điều khoản dịch vụ')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Đăng ký thất bại')
                return
            }

            // Do NOT auto login; redirect to login page
            setSuccess('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục')
            setTimeout(() => {
                navigate('/login')
            }, 1200)
        } catch (err) {
            setError(err.message || 'Lỗi kết nối với server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="full-page page-gradient flex items-center justify-center section-padding">
            <div className="w-full max-w-md">
                <div className="form-card">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h2>
                    <p className="text-gray-600 mb-6">Start your Japanese learning journey with AI-powered lessons</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                className="form-input"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="johndoe"
                                className="form-input"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="form-input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="form-input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="termsAgreed"
                                className="w-4 h-4 accent-green-600"
                                checked={formData.termsAgreed}
                                onChange={handleInputChange}
                                required
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                                    Terms of Service
                                </a>
                            </span>
                        </label>
                        <Button size="lg" className="w-full" disabled={loading}>
                            {loading ? 'Đang tạo tài khoản...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 font-bold hover:text-green-700">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
