import React, { useState } from 'react'
import './AdminLogin.css'

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple admin authentication
    // In production, connect to a real backend
    const ADMIN_EMAIL = 'admin@chitkarabuzz.com'
    const ADMIN_PASSWORD = 'ChitkaBuzz@2026'

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Save admin session
      localStorage.setItem('adminToken', 'auth_token_' + Date.now())
      localStorage.setItem('adminEmail', email)
      setLoading(false)
      onLoginSuccess()
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Chitkara Buzz Admin</h1>
          <p>Login to manage clubs and events</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@chitkarabuzz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@chitkarabuzz.com</p>
          <p>Password: ChitkaBuzz@2026</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
