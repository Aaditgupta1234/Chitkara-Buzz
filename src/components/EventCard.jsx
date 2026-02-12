import React, { useState, useEffect } from 'react'
import './EventCard.css'
import { useApp } from '../context/AppContext'
import { getCountdown, shareEvent, getCategoryIcon } from '../utils/helpers'

function EventCard({ event, onClick }) {
  const [imageError, setImageError] = useState(false)
  const [countdown, setCountdown] = useState({ text: '', urgent: false, expired: false })
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const { isBookmarked, toggleBookmark, isRegisteredForEvent } = useApp()
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

  const getDateFormat = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getOccupancyPercentage = () => {
    return Math.round((event.registered / event.capacity) * 100)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Fallback gradient based on category
  const getFallbackGradient = () => {
    const gradients = {
      'Technology': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Cultural': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Sports': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Business': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Workshop': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Creative': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
    return gradients[event.category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    toggleBookmark(event.id)
  }

  const handleShareClick = (e) => {
    e.stopPropagation()
    setShowShareMenu(!showShareMenu)
  }

  const handleShare = async (platform, e) => {
    e.stopPropagation()
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

  return (
    <div className={`event-card ${isRegistered ? 'registered' : ''}`} onClick={onClick}>
      {/* Registered badge */}
      {isRegistered && (
        <div className="registered-badge">
          <span>✓ Registered</span>
        </div>
      )}

      {/* Quick action buttons */}
      <div className="card-quick-actions">
        <button 
          className={`quick-action-btn bookmark-btn ${bookmarked ? 'active' : ''}`}
          onClick={handleBookmarkClick}
          title={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          {bookmarked ? '★' : '☆'}
        </button>
        <div className="share-container">
          <button 
            className="quick-action-btn share-btn"
            onClick={handleShareClick}
            title="Share event"
          >
            📤
          </button>
          {showShareMenu && (
            <div className="share-menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={(e) => handleShare('whatsapp', e)}>
                <span>💬</span> WhatsApp
              </button>
              <button onClick={(e) => handleShare('twitter', e)}>
                <span>🐦</span> Twitter
              </button>
              <button onClick={(e) => handleShare('email', e)}>
                <span>📧</span> Email
              </button>
              <button onClick={(e) => handleShare('copy', e)}>
                <span>{copied ? '✓' : '📋'}</span> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="event-image">
        {!imageError && event.banner ? (
          <img 
            src={event.banner} 
            alt={event.title} 
            onError={handleImageError}
          />
        ) : (
          <div className="image-fallback" style={{ background: getFallbackGradient() }}>
            <span className="fallback-icon">{getCategoryIcon(event.category)}</span>
            <span className="fallback-text">{event.category}</span>
          </div>
        )}
        
        {/* Countdown badge */}
        <div className={`countdown-badge ${countdown.urgent ? 'urgent' : ''} ${countdown.expired ? 'expired' : ''}`}>
          <span className="countdown-icon">⏱️</span>
          <span className="countdown-text">{countdown.text}</span>
        </div>

        <div className="event-date-badge">
          <div className="date">{getDateFormat(event.date)}</div>
          <div className="time">{event.time}</div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-club">
          <span className="club-icon">{getCategoryIcon(event.category)}</span>
          {event.club}
        </div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-location">
          <span className="icon">📍</span> {event.location}
        </p>
        <div className="event-category">
          <span className="category-tag">{event.category}</span>
        </div>
        <div className="event-occupancy">
          <div className="occupancy-bar">
            <div
              className="occupancy-fill"
              style={{ width: `${getOccupancyPercentage()}%` }}
            ></div>
          </div>
          <span className="occupancy-text">
            {event.registered} / {event.capacity} registered
          </span>
        </div>
        <p className="event-description">{event.description.substring(0, 80)}...</p>
      </div>
      <div className="event-footer">
        <button className="view-btn">
          {isRegistered ? '✓ View Details' : 'View Details'}
        </button>
      </div>
    </div>
  )
}

export default EventCard
