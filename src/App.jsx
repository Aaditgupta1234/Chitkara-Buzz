import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Header from './components/Header'
import EventCard from './components/EventCard'
import FilterBar from './components/FilterBar'
import EventModal from './components/EventModal'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { generateDemoEventsForClub } from './utils/eventFetcher'

function App() {
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [registeredClubs, setRegisteredClubs] = useState([])

  // Events state
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Check if admin is logged in on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setIsAdmin(true)
    }

    // Load registered clubs
    const savedClubs = localStorage.getItem('registeredClubs')
    if (savedClubs) {
      const clubs = JSON.parse(savedClubs)
      setRegisteredClubs(clubs)
      fetchEventsFromRegisteredClubs(clubs)
    } else {
      // Use default mock events if no clubs registered
      loadDefaultMockEvents()
    }
  }, [])

  const loadDefaultMockEvents = () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Code Crusaders Hackathon 2026',
        club: 'Code Crusaders',
        category: 'Technical',
        date: '2026-02-20',
        time: '10:00 AM',
        location: 'Main Auditorium',
        banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
        description: 'Join us for an exciting 24-hour hackathon featuring amazing prizes and networking opportunities.',
        registrationLink: 'https://example.com/register-hackathon',
        capacity: 150,
        registered: 89,
        clubWebsite: '#'
      },
      {
        id: 2,
        title: 'Business Club Investment Summit',
        club: 'Business Club',
        category: 'Business',
        date: '2026-02-22',
        time: '2:00 PM',
        location: 'Conference Room A',
        banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        description: 'Learn about investment strategies from industry experts. Perfect for aspiring entrepreneurs.',
        registrationLink: 'https://example.com/register-summit',
        capacity: 100,
        registered: 67,
        clubWebsite: '#'
      },
      {
        id: 3,
        title: 'Cultural Fest: Colors of India',
        club: 'Cultural Club',
        category: 'Cultural',
        date: '2026-02-25',
        time: '6:00 PM',
        location: 'Open Ground',
        banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
        description: 'Celebrate the vibrant culture with traditional dance, music, and food.',
        registrationLink: 'https://example.com/register-culturalfest',
        capacity: 500,
        registered: 234,
        clubWebsite: '#'
      },
      {
        id: 4,
        title: 'Sports Tournament: Cricket League',
        club: 'Sports Club',
        category: 'Sports',
        date: '2026-03-01',
        time: '3:00 PM',
        location: 'Cricket Ground',
        banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop',
        description: 'Compete with teams from different departments. Registration open for all teams.',
        registrationLink: 'https://example.com/register-cricket',
        capacity: 200,
        registered: 142,
        clubWebsite: '#'
      },
      {
        id: 5,
        title: 'Art Exhibition: Student Showcase',
        club: 'Art & Design Club',
        category: 'Arts',
        date: '2026-02-28',
        time: '5:30 PM',
        location: 'Central Gallery',
        banner: 'https://images.unsplash.com/photo-1460661152884-922fd5212272?w=400&h=250&fit=crop',
        description: 'Witness amazing artworks created by talented students from various disciplines.',
        registrationLink: 'https://example.com/register-artexhibition',
        capacity: 300,
        registered: 189,
        clubWebsite: '#'
      },
      {
        id: 6,
        title: 'Tech Talk: AI & Machine Learning',
        club: 'Tech Innovation Club',
        category: 'Technical',
        date: '2026-03-05',
        time: '11:00 AM',
        location: 'Seminar Hall B',
        banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
        description: 'Industry expert sharing insights on the future of AI and ML in tech.',
        registrationLink: 'https://example.com/register-techtalk',
        capacity: 120,
        registered: 98,
        clubWebsite: '#'
      },
      {
        id: 7,
        title: 'Debate Championship',
        club: 'Debate Society',
        category: 'Competition',
        date: '2026-03-08',
        time: '1:00 PM',
        location: 'Main Hall',
        banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        description: 'Annual inter-college debate competition. Topics will be announced a week before.',
        registrationLink: 'https://example.com/register-debate',
        capacity: 80,
        registered: 56,
        clubWebsite: '#'
      },
      {
        id: 8,
        title: 'Startup Pitch Night',
        club: 'Entrepreneurship Club',
        category: 'Business',
        date: '2026-03-12',
        time: '7:00 PM',
        location: 'Innovation Hub',
        banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        description: 'Pitch your startup ideas to investors and get funding opportunities.',
        registrationLink: 'https://example.com/register-startup',
        capacity: 150,
        registered: 102,
        clubWebsite: '#'
      },
    ]

    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
    setLoading(false)
  }

  const fetchEventsFromRegisteredClubs = async (clubs) => {
    setLoading(true)
    try {
      const allEvents = []

      // Generate demo events for each registered club
      for (const club of clubs) {
        const clubEvents = generateDemoEventsForClub(club)
        allEvents.push(...clubEvents)
      }

      if (allEvents.length === 0) {
        loadDefaultMockEvents()
      } else {
        setEvents(allEvents)
        setFilteredEvents(allEvents)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      loadDefaultMockEvents()
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

  const handleClubsUpdate = (clubs) => {
    setRegisteredClubs(clubs)
    fetchEventsFromRegisteredClubs(clubs)
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

  const uniqueClubs = [...new Set(events.map(e => e.club))]
  const uniqueCategories = [...new Set(events.map(e => e.category))]
  
  return (
    <div className="app">
      <Header onAdminClick={handleAdminClick} isAdmin={isAdmin} />
      
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
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading upcoming events...</p>
            </div>
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
          {uniqueClubs.length > 0 ? (
            <div className="clubs-grid-simple">
              {uniqueClubs.map((club) => (
                <div key={club} className="club-item">
                  <div className="club-name">📚 {club}</div>
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
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}

export default App