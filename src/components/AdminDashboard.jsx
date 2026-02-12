import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'
import AddClubForm from './AddClubForm'
import AddEventForm from './AddEventForm'

function AdminDashboard({ onLogout, onClubsUpdate }) {
  const [clubs, setClubs] = useState([])
  const [events, setEvents] = useState([])
  const [showAddClubForm, setShowAddClubForm] = useState(false)
  const [showAddEventForm, setShowAddEventForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingClubId, setEditingClubId] = useState(null)
  const [editingName, setEditingName] = useState('')
  
  // Full edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClub, setEditingClub] = useState(null)

  const categories = [
    'Technology',
    'Cultural',
    'Sports',
    'Business',
    'Creative',
    'Technical',
    'Arts',
    'Competition',
    'Other'
  ]

  useEffect(() => {
    // Load clubs from localStorage
    const savedClubs = localStorage.getItem('registeredClubs')
    if (savedClubs) {
      setClubs(JSON.parse(savedClubs))
    }
    
    // Load events from localStorage
    const savedEvents = localStorage.getItem('manualEvents')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
    setLoading(false)
  }, [])

  const handleAddClub = (newClub) => {
    const updatedClubs = [...clubs, { ...newClub, id: Date.now() }]
    setClubs(updatedClubs)
    localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
    onClubsUpdate(updatedClubs)
    setShowAddClubForm(false)
  }

  const handleAddEvent = (newEvent) => {
    // Get existing events from localStorage
    const savedEvents = localStorage.getItem('manualEvents')
    const existingEvents = savedEvents ? JSON.parse(savedEvents) : []
    
    // Add new event
    const updatedEvents = [...existingEvents, newEvent]
    localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
    
    // Trigger update
    onClubsUpdate(clubs) // This will trigger a re-fetch
    setShowAddEventForm(false)
  }

  const handleDeleteEvent = (eventId) => {
    const eventToDelete = events.find(event => event.id === eventId)
    const eventTitle = eventToDelete?.title || 'this event'
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventTitle}"?`
    )
    
    if (confirmed) {
      const updatedEvents = events.filter(event => event.id !== eventId)
      setEvents(updatedEvents)
      localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
      onClubsUpdate(clubs)
    }
  }

  const handleDeleteClub = (clubId) => {
    const clubToDelete = clubs.find(club => club.id === clubId)
    const clubName = clubToDelete?.name || 'this club'
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${clubName}"?\n\nThis will remove the club and all its events from the platform.`
    )
    
    if (confirmed) {
      const updatedClubs = clubs.filter(club => club.id !== clubId)
      setClubs(updatedClubs)
      localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
      onClubsUpdate(updatedClubs)
    }
  }

  const handleRenameClick = (club) => {
    setEditingClubId(club.id)
    setEditingName(club.name)
  }

  const handleRenameClub = (clubId) => {
    if (editingName.trim()) {
      const updatedClubs = clubs.map(club =>
        club.id === clubId ? { ...club, name: editingName } : club
      )
      setClubs(updatedClubs)
      localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
      onClubsUpdate(updatedClubs)
      setEditingClubId(null)
      setEditingName('')
    }
  }

  const handleCancelRename = () => {
    setEditingClubId(null)
    setEditingName('')
  }

  // Full edit handlers
  const handleEditClick = (club) => {
    setEditingClub({ ...club })
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingClub(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveEdit = () => {
    if (!editingClub.name.trim()) {
      alert('Club name is required')
      return
    }
    
    const updatedClubs = clubs.map(club =>
      club.id === editingClub.id ? { ...editingClub } : club
    )
    setClubs(updatedClubs)
    localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
    onClubsUpdate(updatedClubs)
    setShowEditModal(false)
    setEditingClub(null)
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingClub(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    onLogout()
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-main">
          {/* Manual Events Section */}
          <div className="dashboard-section events-section">
            <div className="section-header">
              <h2>📅 Events ({events.length})</h2>
              <button
                onClick={() => {
                  setShowAddEventForm(!showAddEventForm)
                  setShowAddClubForm(false)
                }}
                className="add-club-btn"
              >
                {showAddEventForm ? '✕ Cancel' : '+ Add New Event'}
              </button>
            </div>

            {showAddEventForm && clubs.length > 0 && (
              <AddEventForm
                clubs={clubs}
                onAddEvent={handleAddEvent}
                onCancel={() => setShowAddEventForm(false)}
              />
            )}

            {showAddEventForm && clubs.length === 0 && (
              <div className="alert-box">
                <p>⚠️ Please add at least one club before creating events.</p>
              </div>
            )}

            {/* Events List */}
            {events.length > 0 ? (
              <div className="events-list">
                {events.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-item-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                    <div className="event-item-content">
                      <h4>{event.title}</h4>
                      <div className="event-item-meta">
                        <span className="event-club-tag">{event.club}</span>
                        <span className="event-date-tag">📅 {event.date}</span>
                        <span className="event-time-tag">🕐 {event.time}</span>
                      </div>
                      <p className="event-item-location">📍 {event.location}</p>
                      <div className="event-capacity">
                        <div className="capacity-bar">
                          <div 
                            className="capacity-fill" 
                            style={{ width: `${(event.registeredCount / event.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="capacity-text">
                          {event.registeredCount}/{event.maxCapacity} registered
                        </span>
                      </div>
                    </div>
                    <button 
                      className="delete-event-btn"
                      onClick={() => handleDeleteEvent(event.id)}
                      title="Delete event"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No events created yet</p>
                <p className="empty-hint">Click "Add New Event" to create an event</p>
              </div>
            )}
          </div>

          {/* Registered Clubs Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Registered Clubs</h2>
              <button
                onClick={() => {
                  setShowAddClubForm(!showAddClubForm)
                  setShowAddEventForm(false)
                }}
                className="add-club-btn"
              >
                {showAddClubForm ? '✕ Cancel' : '+ Add New Club'}
              </button>
            </div>

            {showAddClubForm && (
              <AddClubForm
                onAddClub={handleAddClub}
                onCancel={() => setShowAddClubForm(false)}
              />
            )}

            {loading ? (
              <div className="loading">Loading clubs...</div>
            ) : clubs.length > 0 ? (
              <div className="clubs-grid">
                {clubs.map((club) => (
                  <div key={club.id} className="club-card">
                    <div className="club-logo-section">
                      {club.logo ? (
                        <img src={club.logo} alt={`${club.name} logo`} className="club-logo" />
                      ) : (
                        <div className="club-logo-placeholder">
                          {club.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="club-header">
                      {editingClubId === club.id ? (
                        <div className="rename-input-group">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="Enter new club name"
                            className="rename-input"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRenameClub(club.id)}
                            className="save-rename-btn"
                            title="Save new name"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="cancel-rename-btn"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3>{club.name}</h3>
                          <div className="club-actions">
                            <button
                              onClick={() => handleEditClick(club)}
                              className="edit-btn"
                              title="Edit club"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClub(club.id)}
                              className="delete-btn"
                              title="Delete club"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="club-info">
                      <p className="club-category">
                        📂 <strong>Category:</strong> {club.category}
                      </p>
                      <p className="club-url">
                        🔗 <strong>Website:</strong><br />
                        <a href={club.website} target="_blank" rel="noopener noreferrer">
                          {club.website}
                        </a>
                      </p>
                      <p className="club-description">
                        {club.description}
                      </p>
                    </div>
                    <div className="club-footer">
                      <span className="status-badge">✓ Active</span>
                      <span className="added-date">
                        Added: {new Date(club.id).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No clubs registered yet</p>
                <p className="empty-hint">Click "Add New Club" to register a club</p>
              </div>
            )}
          </div>

          <div className="dashboard-section info-section">
            <h2>System Information</h2>
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">Total Clubs:</span>
                <span className="info-value">{clubs.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Events:</span>
                <span className="info-value">{events.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Admin User:</span>
                <span className="info-value">
                  {localStorage.getItem('adminEmail')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">System Status:</span>
                <span className="info-value status-active">Online</span>
              </div>
            </div>

            <div className="help-section">
              <h3>How It Works</h3>
              <ol className="help-list">
                <li>Add your college clubs with their details</li>
                <li>Create events associated with each club</li>
                <li>Events are displayed on the main page</li>
                <li>Students can view and register for events</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Club Modal */}
      {showEditModal && editingClub && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Club</h2>
              <button className="close-modal-btn" onClick={handleCancelEdit}>✕</button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-form-group">
                <label>Club Logo URL</label>
                <input
                  type="url"
                  name="logo"
                  value={editingClub.logo || ''}
                  onChange={handleEditChange}
                  placeholder="https://example.com/logo.png"
                />
                {editingClub.logo && (
                  <div className="logo-preview">
                    <img src={editingClub.logo} alt="Logo preview" />
                  </div>
                )}
              </div>
              <div className="edit-form-group">
                <label>Club Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingClub.name}
                  onChange={handleEditChange}
                  placeholder="Enter club name"
                  required
                />
              </div>
              <div className="edit-form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={editingClub.category}
                  onChange={handleEditChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="edit-form-group">
                <label>Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={editingClub.website}
                  onChange={handleEditChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="edit-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editingClub.description || ''}
                  onChange={handleEditChange}
                  placeholder="Describe the club..."
                  rows="4"
                />
              </div>
            </div>
            <div className="edit-modal-footer">
              <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="save-edit-btn" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
