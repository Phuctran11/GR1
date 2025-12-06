import { Link } from 'react-router-dom'
import Button from './Button'

/**
 * Navbar Component
 * Displays logo, navigation, and auth buttons
 */
export default function Navbar({ isLoggedIn = false, onLogout = () => { } }) {
    return (
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo / Branding */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
                        日
                    </div>
                    <span className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        Nihongo Learn
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/#features"
                        className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        to="/#about"
                        className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                        About
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex gap-3 items-center">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button variant="primary" size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
