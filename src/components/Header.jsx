import React from 'react'
import './Header.css'
import { useApp } from '../context/AppContext'

function Header({ onAdminClick, isAdmin, student, onStudentLoginClick, onStudentLogout }) {
  const { darkMode, toggleTheme, bookmarks } = useApp()
  
  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
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
            <p>COLLEGE EVENTS HUB</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#events" className="nav-link">Events</a>
          <a href="#clubs" className="nav-link">Clubs</a>
          <a href="#about" className="nav-link">About</a>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Bookmarks Indicator */}
          {bookmarks.length > 0 && (
            <div className="bookmarks-indicator" title={`${bookmarks.length} bookmarked events`}>
              <span className="bookmark-icon">🔖</span>
              <span className="bookmark-count">{bookmarks.length}</span>
            </div>
          )}
          
          {student ? (
            <div className="logged-in-badge student-badge">
              <span className="pulse-dot"></span>
              <span className="logged-text">Logged in as <strong>{student.name}</strong></span>
              <button onClick={onStudentLogout} className="logout-mini-btn" title="Logout">
                ✕
              </button>
            </div>
          ) : (
            <button onClick={onStudentLoginClick} className="student-login-btn">
              <span className="btn-icon">👤</span>
              <span>Student Login</span>
            </button>
          )}
          
          {isAdmin ? (
            <div className="logged-in-badge admin-badge">
              <span className="pulse-dot"></span>
              <span className="logged-text"><strong>Admin</strong></span>
              <button onClick={onAdminClick} className="admin-panel-btn" title="Go to Admin Panel">
                ⚙️
              </button>
            </div>
          ) : (
            <button onClick={onAdminClick} className="admin-btn">
              <span className="btn-icon">🔐</span>
              <span>Admin</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
