/**
 * INTEGRATION EXAMPLES FOR CHITKARA BUZZ
 * 
 * This file shows different ways to integrate event data sources
 * Replace the fetchAllEvents() function in App.jsx with your preferred method
 */

// ============================================
// EXAMPLE 1: Fetch from Multiple Club APIs
// ============================================
export const fetchFromMultipleClubAPIs = async () => {
    try {
        const clubs = [
            { name: 'Code Crusaders', url: 'https://codecrusaders.chitkara.edu.in/api/events' },
            { name: 'Business Club', url: 'https://businessclub.chitkara.edu.in/api/events' },
            { name: 'Cultural Club', url: 'https://culturalclub.chitkara.edu.in/api/events' },
            { name: 'Sports Club', url: 'https://sportsclub.chitkara.edu.in/api/events' },
            { name: 'Art & Design Club', url: 'https://artdesignclub.chitkara.edu.in/api/events' },
            { name: 'Tech Innovation Club', url: 'https://techtalk.chitkara.edu.in/api/events' },
        ]

        const promises = clubs.map(club =>
            fetch(club.url)
                .then(res => res.json())
                .catch(err => {
                    console.warn(`Failed to fetch from ${club.name}:`, err)
                    return []
                })
        )

        const allEventsArrays = await Promise.allSettled(promises)
        const allEvents = allEventsArrays
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value || [])

        return allEvents
    } catch (error) {
        console.error('Error fetching from club APIs:', error)
        return []
    }
}

// ============================================
// EXAMPLE 2: Central College API Endpoint
// ============================================
export const fetchFromCentralAPI = async () => {
    try {
        const response = await fetch('https://api.chitkara.edu.in/v1/all-events')

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        return data.events || []
    } catch (error) {
        console.error('Error fetching from central API:', error)
        return []
    }
}

// ============================================
// EXAMPLE 3: Web Scraping with Backend
// ============================================
export const fetchFromScraperBackend = async () => {
    try {
        // Your backend service scrapes club websites and aggregates data
        const response = await fetch('https://events-scraper-api.chitkara.edu.in/api/scrape-all')

        if (!response.ok) {
            throw new Error(`Scraper API Error: ${response.status}`)
        }

        const data = await response.json()
        return data.events || []
    } catch (error) {
        console.error('Error fetching from scraper backend:', error)
        return []
    }
}

// ============================================
// EXAMPLE 4: Firebase Realtime Database
// ============================================
export const fetchFromFirebase = async () => {
    try {
        const response = await fetch(
            'https://chitkara-events.firebaseio.com/events.json'
        )

        if (!response.ok) {
            throw new Error(`Firebase Error: ${response.status}`)
        }

        const data = await response.json()
        // Convert Firebase object to array
        const events = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }))

        return events
    } catch (error) {
        console.error('Error fetching from Firebase:', error)
        return []
    }
}

// ============================================
// EXAMPLE 5: REST API with Authentication
// ============================================
export const fetchWithAuthentication = async () => {
    const apiKey = process.env.REACT_APP_API_KEY
    const apiUrl = process.env.REACT_APP_API_URL

    try {
        const response = await fetch(`${apiUrl}/api/events`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        return data.events || []
    } catch (error) {
        console.error('Error fetching with authentication:', error)
        return []
    }
}

// ============================================
// EXAMPLE 6: GraphQL Query
// ============================================
export const fetchFromGraphQL = async () => {
    const query = `
    query {
      allEvents {
        id
        title
        club
        category
        date
        time
        location
        banner
        description
        registrationLink
        capacity
        registered
      }
    }
  `

    try {
        const response = await fetch('https://graphql-api.chitkara.edu.in/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        if (!response.ok) {
            throw new Error(`GraphQL Error: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('GraphQL Errors:', data.errors)
            return []
        }

        return data.data.allEvents || []
    } catch (error) {
        console.error('Error fetching from GraphQL:', error)
        return []
    }
}

// ============================================
// EXAMPLE 7: Hybrid Approach (Multiple Sources)
// ============================================
export const fetchFromHybridSources = async () => {
    try {
        // Try central API first
        const centralAPI = await fetchFromCentralAPI()

        if (centralAPI.length > 0) {
            return centralAPI
        }

        // Fallback to club APIs if central API fails
        console.log('Central API unavailable, falling back to club APIs...')
        return await fetchFromMultipleClubAPIs()
    } catch (error) {
        console.error('Error in hybrid fetch:', error)
        return []
    }
}

// ============================================
// EXAMPLE 8: Polling for Real-time Updates
// ============================================
export const pollForUpdates = async (callback, interval = 30000) => {
    // Initial fetch
    const events = await fetchFromCentralAPI()
    callback(events)

    // Poll every {interval} milliseconds
    const pollInterval = setInterval(async () => {
        try {
            const newEvents = await fetchFromCentralAPI()
            callback(newEvents)
        } catch (error) {
            console.error('Error during polling:', error)
        }
    }, interval)

    // Return function to stop polling
    return () => clearInterval(pollInterval)
}

// ============================================
// HOW TO USE IN APP.jsx
// ============================================

/*
import { fetchFromMultipleClubAPIs } from './integration-examples'

// In your App component:
useEffect(() => {
  const fetchAllEvents = async () => {
    setLoading(true)
    try {
      const events = await fetchFromMultipleClubAPIs()
      setEvents(events)
      setFilteredEvents(events)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchAllEvents()
}, [])
*/

// ============================================
// ENVIRONMENT VARIABLES (.env)
// ============================================

/*
REACT_APP_API_URL=https://api.chitkara.edu.in
REACT_APP_API_KEY=your_api_key_here
REACT_APP_FIREBASE_URL=https://chitkara-events.firebaseio.com
*/

// ============================================
// DATA TRANSFORMATION EXAMPLE
// ============================================
export const transformEventData = (rawData) => {
    /**
     * If your API returns data in a different format,
     * transform it to the expected format
     */
    return rawData.map(event => ({
        id: event.id || event._id,
        title: event.title || event.eventName,
        club: event.club || event.organizingClub,
        category: event.category || event.eventType,
        date: event.date || event.eventDate,
        time: event.time || event.startTime,
        location: event.location || event.venue,
        banner: event.banner || event.imageUrl || event.thumbnailUrl,
        description: event.description || event.details,
        registrationLink: event.registrationLink || event.registerUrl,
        capacity: event.capacity || event.maxParticipants,
        registered: event.registered || event.enrolledCount || 0,
    }))
}

export default {
    fetchFromMultipleClubAPIs,
    fetchFromCentralAPI,
    fetchFromScraperBackend,
    fetchFromFirebase,
    fetchWithAuthentication,
    fetchFromGraphQL,
    fetchFromHybridSources,
    pollForUpdates,
    transformEventData,
}
