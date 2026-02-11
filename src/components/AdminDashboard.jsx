import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'
import AddClubForm from './AddClubForm'

function AdminDashboard({ onLogout, onClubsUpdate }) {
  const [clubs, setClubs] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingClubId, setEditingClubId] = useState(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    // Load clubs from localStorage
    const savedClubs = localStorage.getItem('registeredClubs')
    if (savedClubs) {
      setClubs(JSON.parse(savedClubs))
    }
    setLoading(false)
  }, [])

  const handleAddClub = (newClub) => {
    const updatedClubs = [...clubs, { ...newClub, id: Date.now() }]
    setClubs(updatedClubs)
    localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
    onClubsUpdate(updatedClubs)
    setShowAddForm(false)
  }

  const handleDeleteClub = (clubId) => {
    const updatedClubs = clubs.filter(club => club.id !== clubId)
    setClubs(updatedClubs)
    localStorage.setItem('registeredClubs', JSON.stringify(updatedClubs))
    onClubsUpdate(updatedClubs)
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
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Registered Clubs</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="add-club-btn"
              >
                {showAddForm ? '✕ Cancel' : '+ Add New Club'}
              </button>
            </div>

            {showAddForm && (
              <AddClubForm
                onAddClub={handleAddClub}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {loading ? (
              <div className="loading">Loading clubs...</div>
            ) : clubs.length > 0 ? (
              <div className="clubs-grid">
                {clubs.map((club) => (
                  <div key={club.id} className="club-card">
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
                              onClick={() => handleRenameClick(club)}
                              className="rename-btn"
                              title="Rename club"
                            >
                              ✎
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
                <li>Add your college clubs with their website URLs</li>
                <li>The system automatically fetches events from club websites</li>
                <li>Events are aggregated and displayed on the main page</li>
                <li>Students can click events to visit the club website</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
