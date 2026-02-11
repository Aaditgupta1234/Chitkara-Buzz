import React from 'react'
import './EventCard.css'

function EventCard({ event, onClick }) {
  const getDateFormat = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getOccupancyPercentage = () => {
    return Math.round((event.registered / event.capacity) * 100)
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
        <img src={event.banner} alt={event.title} title={event.clubWebsite ? 'Click to visit club website' : ''} />
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
