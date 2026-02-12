import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Header from './components/Header'
import EventCard from './components/EventCard'
import FilterBar from './components/FilterBar'
import EventModal from './components/EventModal'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import StudentLogin from './components/StudentLogin'
import StudentRegister from './components/StudentRegister'
import { SkeletonGrid } from './components/SkeletonCard'
import { initializeDummyData, forceRefreshDummyData, dummyClubs, dummyEvents } from './data/dummyData'
import { useApp } from './context/AppContext'

function App() {
  const { darkMode } = useApp()
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [registeredClubs, setRegisteredClubs] = useState([])

  // Student auth state
  const [student, setStudent] = useState(null)
  const [showStudentAuth, setShowStudentAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  // Events state
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Startup animation state
  const [showSplash, setShowSplash] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Apply dark mode to body
  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode)
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  // Check if admin is logged in on component mount
  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setIsAdmin(true)
    }

    // Check if student is logged in
    const studentToken = localStorage.getItem('studentToken')
    const studentData = localStorage.getItem('studentData')
    if (studentToken && studentData) {
      setStudent(JSON.parse(studentData))
    }

    // Force refresh dummy data to ensure correct format
    // Check if data needs migration (old format had 'image' instead of 'banner')
    const savedEvents = localStorage.getItem('manualEvents')
    let needsRefresh = false
    
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents)
        if (parsed.length > 0 && parsed[0].image && !parsed[0].banner) {
          needsRefresh = true
        }
      } catch (e) {
        needsRefresh = true
      }
    }
    
    let parsedClubs, parsedEvents
    
    if (needsRefresh || !savedEvents) {
      // Force refresh with correct data format
      const { clubs, events } = forceRefreshDummyData()
      parsedClubs = clubs
      parsedEvents = events
    } else {
      const savedClubs = localStorage.getItem('registeredClubs')
      parsedClubs = savedClubs ? JSON.parse(savedClubs) : []
      parsedEvents = JSON.parse(savedEvents)
      
      // Initialize with dummy data if no data exists
      if (parsedClubs.length === 0) {
        localStorage.setItem('registeredClubs', JSON.stringify(dummyClubs))
        parsedClubs = dummyClubs
      }
      
      if (parsedEvents.length === 0) {
        localStorage.setItem('manualEvents', JSON.stringify(dummyEvents))
        parsedEvents = dummyEvents
      }
    }
    
    setRegisteredClubs(parsedClubs)
    setEvents(parsedEvents)
    setFilteredEvents(parsedEvents)
    setLoading(false)

    return () => clearTimeout(splashTimer)
  }, [])

  const fetchEventsFromRegisteredClubs = async (clubs) => {
    setLoading(true)
    console.log('📡 Fetching events from registered clubs:', clubs)
    
    try {
      const allEvents = []

      // Fetch events from each registered club
      for (const club of clubs) {
        try {
          console.log(`🔍 Fetching events for ${club.name} from ${club.website}`)
          
          // Use the backend server to fetch real events
          const response = await fetch('http://localhost:5000/api/fetch-events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clubUrl: club.website,
              clubName: club.name
            })
          })

          if (response.ok) {
            const data = await response.json()
            console.log(`✅ Fetched ${data.events?.length || 0} events from ${club.name}:`, data)
            allEvents.push(...(data.events || []))
          } else {
            console.error(`❌ Failed to fetch from ${club.name}, status: ${response.status}`)
          }
        } catch (error) {
          console.warn(`⚠️ Error fetching from ${club.name}:`, error.message)
        }
      }

      // Load manually added events from localStorage
      const manualEventsStr = localStorage.getItem('manualEvents')
      if (manualEventsStr) {
        try {
          const manualEvents = JSON.parse(manualEventsStr)
          console.log(`✏️ Loaded ${manualEvents.length} manually added events`)
          allEvents.push(...manualEvents)
        } catch (e) {
          console.error('Failed to parse manual events:', e)
        }
      }

      console.log(`📊 Total events collected: ${allEvents.length}`)

      setEvents(allEvents)
      setFilteredEvents(allEvents)
      setLoading(false)
    } catch (error) {
      console.error('💥 Error fetching events:', error)
      setEvents([])
      setFilteredEvents([])
      setLoading(false)
    }
  }

  const handleAdminClick = () => {
    if (isAdmin) {
      // Go to admin dashboard
      setShowAdminLogin(false)
    } else {
      // Show admin login
      setShowAdminLogin(true)
    }
  }

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true)
    setShowAdminLogin(false)
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setShowAdminLogin(false)
  }

  // Student auth handlers
  const handleStudentLoginClick = () => {
    setShowStudentAuth(true)
    setAuthMode('login')
  }

  const handleStudentLoginSuccess = (studentData) => {
    setStudent(studentData)
    setShowStudentAuth(false)
  }

  const handleStudentLogout = () => {
    setStudent(null)
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentData')
  }

  const handleSwitchToRegister = () => {
    setAuthMode('register')
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
  }

  const handleClubsUpdate = (clubs) => {
    setRegisteredClubs(clubs)
    // Reload events from localStorage
    const savedEvents = localStorage.getItem('manualEvents')
    const manualEvents = savedEvents ? JSON.parse(savedEvents) : []
    setEvents(manualEvents)
    setFilteredEvents(manualEvents)
  }

  const handleFilter = (search, club, category) => {
    setSearchQuery(search)
    setSelectedClub(club)
    setSelectedCategory(category)

    let filtered = events

    if (search.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (club !== 'all') {
      filtered = filtered.filter(event => event.club === club)
    }

    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category)
    }

    setFilteredEvents(filtered)
  }

  // If admin login is shown, render login page
  if (showAdminLogin && !isAdmin) {
    return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
  }

  // If admin is logged in, show dashboard
  if (isAdmin && showAdminLogin === false) {
    return <AdminDashboard onLogout={handleAdminLogout} onClubsUpdate={handleClubsUpdate} />
  }

  // If student auth is shown
  if (showStudentAuth) {
    if (authMode === 'login') {
      return (
        <StudentLogin
          onLoginSuccess={handleStudentLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )
    } else {
      return (
        <StudentRegister
          onRegisterSuccess={handleStudentLoginSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )
    }
  }

  const uniqueClubs = [...new Set(events.map(e => e.club))]
  const uniqueCategories = [...new Set(events.map(e => e.category))]

  // Show splash screen on startup
  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-logo">
            <div className="logo-icon">📅</div>
            <h1 className="splash-title">Chitkara Buzz</h1>
            <p className="splash-subtitle">COLLEGE EVENTS HUB</p>
          </div>
          <div className="splash-loader">
            <div className="loader-bar"></div>
          </div>
          <p className="splash-text">Loading amazing events...</p>
        </div>
        <div className="splash-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header 
        onAdminClick={handleAdminClick} 
        isAdmin={isAdmin}
        student={student}
        onStudentLoginClick={handleStudentLoginClick}
        onStudentLogout={handleStudentLogout}
      />
      
      {/* Home Section */}
      <section id="home" className="home-section">
        <div className="home-hero">
          <h2>Welcome to Chitkara Buzz</h2>
          <p>Discover and register for all upcoming college events in one place</p>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <FilterBar
          clubs={uniqueClubs}
          categories={uniqueCategories}
          onFilter={handleFilter}
          searchQuery={searchQuery}
          selectedClub={selectedClub}
          selectedCategory={selectedCategory}
        />

        <main className="main-content">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="clubs-section">
        <div className="section-header">
          <h2>Registered Clubs</h2>
          <p>All clubs participating in Chitkara Buzz</p>
        </div>
        <div className="clubs-list">
          {registeredClubs.length > 0 ? (
            <div className="clubs-grid-simple">
              {registeredClubs.map((club) => (
                <div key={club.id} className="club-item">
                  <div className="club-item-logo">
                    {club.logo ? (
                      <img src={club.logo} alt={`${club.name} logo`} />
                    ) : (
                      <span className="club-logo-fallback">{club.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="club-name">{club.name}</div>
                  <div className="club-category">{club.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-clubs">No clubs registered yet</p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2>About Chitkara Buzz</h2>
        </div>
        <div className="about-content">
          <div className="about-item">
            <h3>🎯 Our Mission</h3>
            <p>To provide a centralized platform where students can discover, explore, and register for all upcoming college events in one place.</p>
          </div>
          <div className="about-item">
            <h3>✨ Features</h3>
            <ul>
              <li>Search events by keyword, club, or category</li>
              <li>Browse events from all registered clubs</li>
              <li>Register for events directly</li>
              <li>Admin panel to manage clubs and events</li>
              <li>Real-time event updates</li>
            </ul>
          </div>
          <div className="about-item">
            <h3>📱 How It Works</h3>
            <ol>
              <li>Browse events from the Events section</li>
              <li>Filter by club or category</li>
              <li>Click on an event to see details</li>
              <li>Register through the club's website</li>
            </ol>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          student={student}
        />
      )}
    </div>
  )
}

export default App