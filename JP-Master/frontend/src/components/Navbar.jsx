import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'

/**
 * Navbar Component
 * Displays logo, navigation, and auth buttons
 */
export default function Navbar({ isLoggedIn = false, user = null, onLogout = () => { } }) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        onLogout()
        setMenuOpen(false)
        navigate('/')
    }

    const initials = (user?.username?.[0] || 'U').toUpperCase()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/95 shadow-md">
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
                        to="/features"
                        className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        to="/about"
                        className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                        About
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex gap-3 items-center relative">
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
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {initials}
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
                                        {user?.username || 'User'}
                                    </div>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-default"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
