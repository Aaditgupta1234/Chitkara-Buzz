import React, { useState, useEffect } from 'react'
import './EventModal.css'
import { useApp } from '../context/AppContext'
import { getCountdown, shareEvent, getCategoryIcon, getCategoryColor } from '../utils/helpers'

function EventModal({ event, onClose, student }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState({ text: '', urgent: false, expired: false })
  
  const { 
    isBookmarked, 
    toggleBookmark, 
    isRegisteredForEvent, 
    registerForEvent, 
    unregisterFromEvent 
  } = useApp()
  
  const bookmarked = isBookmarked(event.id)
  const isRegistered = isRegisteredForEvent(event.id)

  // Update countdown every minute
  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdown(event.date, event.time))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [event.date, event.time])

  const getFullDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getOccupancyPercentage = () => {
    return Math.round((event.registered / event.capacity) * 100)
  }

  const handleShare = async (platform) => {
    if (platform === 'copy') {
      const success = await shareEvent.copyLink(event)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } else {
      shareEvent[platform](event)
    }
    setShowShareMenu(false)
  }

  const handleRegister = () => {
    if (isRegistered) {
      unregisterFromEvent(event.id)
    } else {
      registerForEvent(event.id, student)
    }
  }

  const categoryColor = getCategoryColor(event.category)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Registration status banner */}
        {isRegistered && (
          <div className="registration-banner">
            <span className="reg-icon">✓</span>
            <span>You're registered for this event!</span>
          </div>
        )}

        <div className="modal-image">
          {event.banner ? (
            <img src={event.banner} alt={event.title} />
          ) : (
            <div className="modal-image-fallback" style={{ background: categoryColor.bg }}>
              <span>{getCategoryIcon(event.category)}</span>
            </div>
          )}
          
          {/* Countdown overlay */}
          <div className={`modal-countdown ${countdown.urgent ? 'urgent' : ''}`}>
            <span className="countdown-label">⏱️ {countdown.text}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-title-section">
              <h2>{event.title}</h2>
              <button 
                className={`modal-bookmark-btn ${bookmarked ? 'active' : ''}`}
                onClick={() => toggleBookmark(event.id)}
              >
                {bookmarked ? '★ Saved' : '☆ Save'}
              </button>
            </div>
            <span className="category-badge" style={{ 
              background: categoryColor.bg, 
              color: categoryColor.text,
              borderColor: categoryColor.border 
            }}>
              {getCategoryIcon(event.category)} {event.category}
            </span>
          </div>

          <div className="event-info-grid">
            <div className="info-item">
              <span className="info-label">📅 Date</span>
              <span className="info-value">{getFullDate(event.date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">⏰ Time</span>
              <span className="info-value">{event.time}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📍 Location</span>
              <span className="info-value">{event.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🎯 Club</span>
              <span className="info-value">{event.club}</span>
            </div>
          </div>

          <div className="modal-description">
            <h3>About this event</h3>
            <p>{event.description}</p>
          </div>

          <div className="occupancy-section">
            <h3>Occupancy Status</h3>
            <div className="occupancy-bar-large">
              <div
                className="occupancy-fill"
                style={{ width: `${getOccupancyPercentage()}%` }}
              ></div>
            </div>
            <p className="occupancy-stat">
              {event.registered} out of {event.capacity} spots filled ({getOccupancyPercentage()}%)
            </p>
          </div>

          <div className="modal-actions">
            <button 
              className={`register-btn ${isRegistered ? 'registered' : ''}`}
              onClick={handleRegister}
            >
              {isRegistered ? '✓ Registered - Click to Cancel' : '🎫 Register Now'}
            </button>
            
            <div className="share-dropdown">
              <button 
                className="share-btn"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                📤 Share
              </button>
              {showShareMenu && (
                <div className="share-dropdown-menu">
                  <button onClick={() => handleShare('whatsapp')}>
                    💬 WhatsApp
                  </button>
                  <button onClick={() => handleShare('twitter')}>
                    🐦 Twitter
                  </button>
                  <button onClick={() => handleShare('email')}>
                    📧 Email
                  </button>
                  <button onClick={() => handleShare('copy')}>
                    {copied ? '✓ Copied!' : '📋 Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal
