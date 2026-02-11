import React from 'react'
import './Header.css'

function Header({ onAdminClick, isAdmin }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="8" />
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="white" strokeWidth="6" />
              <rect x="40" y="40" width="20" height="20" fill="white" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>Chitkara Buzz</h1>
            <p>College Events Hub</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#clubs">Clubs</a>
          <a href="#about">About</a>
          <button onClick={onAdminClick} className="admin-btn">
            {isAdmin ? '⚙️ Admin Panel' : '🔐 Admin'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
