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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check token on mount
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  const handleLoginSuccess = (userData, token, rememberFlag = false) => {
    if (token) {
      localStorage.setItem('token', token)
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    if (rememberFlag) {
      localStorage.setItem('rememberMe', 'true')
    }
    setIsLoggedIn(true)
  }

  return (
    <Router>
      <div className="w-full overflow-x-hidden">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <><Hero /><Home isLoggedIn={isLoggedIn} /></>} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
