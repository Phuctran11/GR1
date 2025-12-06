import Button from '../components/Button'

/**
 * Sign Up Page
 */
export default function Signup() {
    return (
        <div className="full-page page-gradient flex items-center justify-center section-padding">
            <div className="w-full max-w-md">
                <div className="form-card">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h2>
                    <p className="text-gray-600 mb-6">Start your Japanese learning journey with AI-powered lessons</p>

                    <form className="space-y-4">
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="form-input"
                            />
                        </div>
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
                        <div>
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="form-input"
                            />
                        </div>
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 accent-green-600" required />
                            <span className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                                    Terms of Service
                                </a>
                            </span>
                        </label>
                        <Button size="lg" className="w-full">
                            Create Account
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
