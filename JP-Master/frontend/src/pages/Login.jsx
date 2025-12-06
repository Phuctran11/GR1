import Button from '../components/Button'

/**
 * Login Page
 */
export default function Login() {
    return (
        <div className="full-page page-gradient flex items-center justify-center section-padding">
            <div className="w-full max-w-md">
                <div className="form-card">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600 mb-6">Sign in to continue your learning journey</p>

                    <form className="space-y-4">
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="form-input"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 accent-green-600" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                                Forgot?
                            </a>
                        </div>
                        <Button size="lg" className="w-full">
                            Sign In
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
