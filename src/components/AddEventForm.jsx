import React, { useState } from 'react'
import './AddEventForm.css'

function AddEventForm({ onAddEvent, onCancel, clubs }) {
  const [formData, setFormData] = useState({
    title: '',
    club: clubs[0]?.name || '',
    category: 'Technical',
    date: '',
    time: '10:00 AM',
    location: '',
    description: '',
    banner: '',
    registrationLink: '',
    capacity: 100,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const selectedClub = clubs.find(c => c.name === formData.club)
      
      const newEvent = {
        ...formData,
        id: Date.now(),
        clubWebsite: selectedClub?.website || '#',
        registered: 0,
        banner: formData.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'
      }

      onAddEvent(newEvent)
      
      // Reset form
      setFormData({
        title: '',
        club: clubs[0]?.name || '',
        category: 'Technical',
        date: '',
        time: '10:00 AM',
        location: '',
        description: '',
        banner: '',
        registrationLink: '',
        capacity: 100,
      })
    }
  }

  return (
    <div className="add-event-form-container">
      <div className="form-header">
        <h3>📅 Add New Event</h3>
        <p>Fill in the event details below</p>
      </div>

      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Tech Talk on AI"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="club">Club *</label>
            <select
              id="club"
              name="club"
              value={formData.club}
              onChange={handleChange}
            >
              {clubs.map(club => (
                <option key={club.id} value={club.name}>{club.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Technical">Technical</option>
              <option value="Business">Business</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts</option>
              <option value="Competition">Competition</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Auditorium"
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="banner">Banner Image URL (optional)</label>
            <input
              type="url"
              id="banner"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="registrationLink">Registration Link (optional)</label>
          <input
            type="url"
            id="registrationLink"
            name="registrationLink"
            value={formData.registrationLink}
            onChange={handleChange}
            placeholder="https://example.com/register"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Event
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEventForm
