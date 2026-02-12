import React, { useState } from 'react'
import './EventCard.css'

function EventCard({ event, onClick }) {
  const [imageError, setImageError] = useState(false)

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

  const handleBannerClick = (e) => {
    // If event has a club website, redirect to it
    if (event.clubWebsite && event.clubWebsite !== '#') {
      e.stopPropagation()
      window.open(event.clubWebsite, '_blank')
      return
    }
  }

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image" onClick={handleBannerClick} style={{ cursor: event.clubWebsite && event.clubWebsite !== '#' ? 'pointer' : 'default' }}>
        {!imageError && event.banner ? (
          <img 
            src={event.banner} 
            alt={event.title} 
            title={event.clubWebsite ? 'Click to visit club website' : ''} 
            onError={handleImageError}
          />
        ) : (
          <div className="image-fallback" style={{ background: getFallbackGradient() }}>
            <span className="fallback-icon">📅</span>
            <span className="fallback-text">{event.category}</span>
          </div>
        )}
        {event.clubWebsite && event.clubWebsite !== '#' && (
          <div className="visit-club-badge">Visit Club →</div>
        )}
        <div className="event-date-badge">
          <div className="date">{getDateFormat(event.date)}</div>
          <div className="time">{event.time}</div>
        </div>
      </div>
      <div className="event-content">
        <div className="event-club">{event.club}</div>
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
        <button className="view-btn">View Details</button>
      </div>
    </div>
  )
}

export default EventCard
