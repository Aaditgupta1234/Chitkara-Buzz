import React from 'react'
import './EventModal.css'

function EventModal({ event, onClose }) {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="modal-image">
          <img src={event.banner} alt={event.title} />
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <h2>{event.title}</h2>
            <span className="category-badge">{event.category}</span>
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
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="register-btn"
            >
              Register Now
            </a>
            <button className="share-btn" onClick={() => {
              const text = `Check out "${event.title}" on Chitkara Buzz! ${event.registrationLink}`
              navigator.clipboard.writeText(text)
              alert('Event link copied to clipboard!')
            }}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal
