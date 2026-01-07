import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Features from './pages/Features'
import About from './pages/About'
import FlashcardPage from './pages/FlashcardPage'
import ReadingGenerate from './pages/ReadingGenerate'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check session on mount by calling verify endpoint (cookie-based auth)
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)
          setUser(data.user)
        }
      } catch (err) {
        // ignore - not logged in
      }
    })()
  }, [])

  const handleLogout = () => {
    // Ask server to clear httpOnly cookie, then clear client state
    ;(async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch (err) {
        // ignore
      }
      setIsLoggedIn(false)
      setUser(null)
    })()
  }

  const handleLoginSuccess = (userData, rememberFlag = false) => {
    // Server sets httpOnly cookie with token; only store minimal user in memory
    if (userData) {
      setUser(userData)
    }
    setIsLoggedIn(true)
  }

  return (
    <Router>
      <div className="w-full overflow-x-hidden pt-20">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} user={user} /> : <><Hero /><Home isLoggedIn={isLoggedIn} user={user} /></>} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/flashcard/:level" element={<FlashcardPage isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />} />
          <Route path="/reading/generate" element={isLoggedIn ? <ReadingGenerate isLoggedIn={isLoggedIn} user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
