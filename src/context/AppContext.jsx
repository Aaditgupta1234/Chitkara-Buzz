import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true // Default to dark mode
  })

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarkedEvents')
    return saved ? JSON.parse(saved) : []
  })

  // Registered events state
  const [registeredEvents, setRegisteredEvents] = useState(() => {
    const saved = localStorage.getItem('registeredEvents')
    return saved ? JSON.parse(saved) : []
  })

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('light-mode', !darkMode)
  }, [darkMode])

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('bookmarkedEvents', JSON.stringify(bookmarks))
  }, [bookmarks])

  // Save registered events
  useEffect(() => {
    localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents))
  }, [registeredEvents])

  const toggleTheme = () => setDarkMode(prev => !prev)

  const toggleBookmark = (eventId) => {
    setBookmarks(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId)
      }
      return [...prev, eventId]
    })
  }

  const isBookmarked = (eventId) => bookmarks.includes(eventId)

  const registerForEvent = (eventId, studentData) => {
    const registration = {
      eventId,
      studentId: studentData?.id || 'guest',
      studentName: studentData?.name || 'Guest',
      registeredAt: new Date().toISOString()
    }
    setRegisteredEvents(prev => {
      if (prev.some(r => r.eventId === eventId)) {
        return prev // Already registered
      }
      return [...prev, registration]
    })
    return true
  }

  const unregisterFromEvent = (eventId) => {
    setRegisteredEvents(prev => prev.filter(r => r.eventId !== eventId))
  }

  const isRegisteredForEvent = (eventId) => {
    return registeredEvents.some(r => r.eventId === eventId)
  }

  const getRegistrationCount = (eventId) => {
    return registeredEvents.filter(r => r.eventId === eventId).length
  }

  const value = {
    darkMode,
    toggleTheme,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    registeredEvents,
    registerForEvent,
    unregisterFromEvent,
    isRegisteredForEvent,
    getRegistrationCount
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export default AppContext
