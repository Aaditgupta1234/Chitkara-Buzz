import React, { useState } from 'react'
import './AddClubForm.css'

function AddClubForm({ onAddClub, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: 'Technical',
    description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Technical',
    'Business',
    'Cultural',
    'Sports',
    'Arts',
    'Competition',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateURL = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Club name is required')
      return
    }
    if (!formData.website.trim()) {
      setError('Website URL is required')
      return
    }
    if (!validateURL(formData.website)) {
      setError('Please enter a valid website URL (e.g., https://example.com)')
      return
    }

    setLoading(true)

    try {
      // Add club
      onAddClub({
        ...formData,
        website: formData.website
      })

      // Reset form
      setFormData({
        name: '',
        website: '',
        category: 'Technical',
        description: '',
      })
    } catch (err) {
      setError('Failed to add club. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-club-form-container">
      <form onSubmit={handleSubmit} className="add-club-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Club Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g., Code Crusaders"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="website">Website URL *</label>
          <input
            id="website"
            type="url"
            name="website"
            placeholder="e.g., https://codecrusaders.chitkara.edu.in"
            value={formData.website}
            onChange={handleChange}
            required
          />
          <p className="form-hint">
            The website where your club's events are published
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Brief description of your club"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Adding Club...' : 'Add Club'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClubForm
