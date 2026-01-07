import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { apiFetch } from '../apiClient'

/**
 * Login Page
 */
export default function Login({ onLoginSuccess = () => { } }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Login failed')
                return
            }

            // Server sets httpOnly cookie; update parent state with user only
            onLoginSuccess(data.user, rememberMe)

            setSuccess('Login successful! Redirecting...')
            navigate('/')
        } catch (err) {
            setError(err.message || 'Unable to reach server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="full-page page-gradient flex items-center justify-center section-padding">
            <div className="w-full max-w-md">
                <div className="form-card">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
                    <p className="text-gray-600 mb-6">Sign in to continue your learning journey</p>

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
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-green-600"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                                Forgot?
                            </a>
                        </div>
                        <Button size="lg" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-green-600 font-bold hover:text-green-700">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
