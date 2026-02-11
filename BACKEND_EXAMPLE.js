/**
 * SAMPLE BACKEND API FOR CHITKARA BUZZ
 * 
 * This is a Node.js/Express example showing how to create
 * a backend that aggregates events from multiple club websites
 * and provides them to Chitkara Buzz frontend
 */

// ============================================
// OPTION 1: Express.js Backend
// ============================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Enable CORS for the Chitkara Buzz frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://your-domain.com'],
    credentials: true
}));

app.use(express.json());

// ============================================
// ENDPOINT 1: Get All Events
// ============================================
app.get('/api/events', async (req, res) => {
    try {
        const allEvents = await aggregateEventsFromClubs();
        res.json({
            success: true,
            events: allEvents,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            message: error.message
        });
    }
});

// ============================================
// ENDPOINT 2: Get Events by Club
// ============================================
app.get('/api/events/club/:clubName', async (req, res) => {
    try {
        const { clubName } = req.params;
        const clubEvents = await getEventsByClub(clubName);
        res.json({
            success: true,
            club: clubName,
            events: clubEvents,
            count: clubEvents.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ENDPOINT 3: Get Events by Category
// ============================================
app.get('/api/events/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const allEvents = await aggregateEventsFromClubs();
        const categoryEvents = allEvents.filter(e => e.category === category);
        res.json({
            success: true,
            category: category,
            events: categoryEvents,
            count: categoryEvents.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ENDPOINT 4: Get Upcoming Events Only
// ============================================
app.get('/api/events/upcoming', async (req, res) => {
    try {
        const allEvents = await aggregateEventsFromClubs();
        const today = new Date();
        const upcomingEvents = allEvents.filter(e => new Date(e.date) >= today);
        res.json({
            success: true,
            events: upcomingEvents,
            count: upcomingEvents.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// Helper Functions
// ============================================

const CLUB_APIS = [
    {
        name: 'Code Crusaders',
        url: 'https://codecrusaders.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Business Club',
        url: 'https://businessclub.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Cultural Club',
        url: 'https://culturalclub.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Sports Club',
        url: 'https://sportsclub.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Tech Innovation Club',
        url: 'https://techtalk.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Art & Design Club',
        url: 'https://artdesignclub.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Debate Society',
        url: 'https://debate.chitkara.edu.in/api/events',
        timeout: 5000
    },
    {
        name: 'Entrepreneurship Club',
        url: 'https://entrepreneur.chitkara.edu.in/api/events',
        timeout: 5000
    }
];

/**
 * Aggregates events from all club websites
 */
async function aggregateEventsFromClubs() {
    const promises = CLUB_APIS.map(club =>
        axios.get(club.url, { timeout: club.timeout })
            .then(res => {
                // Ensure each event has the club name
                const events = Array.isArray(res.data) ? res.data : (res.data.events || []);
                return events.map(e => ({
                    ...e,
                    club: club.name
                }));
            })
            .catch(error => {
                console.warn(`Failed to fetch from ${club.name}:`, error.message);
                return [];
            })
    );

    const results = await Promise.allSettled(promises);
    const allEvents = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value || [])
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return allEvents;
}

/**
 * Get events by specific club
 */
async function getEventsByClub(clubName) {
    const allEvents = await aggregateEventsFromClubs();
    return allEvents.filter(e => e.club.toLowerCase() === clubName.toLowerCase());
}

// ============================================
// Data Validation & Transformation
// ============================================

function validateEventData(event) {
    const requiredFields = ['title', 'club', 'category', 'date', 'time', 'location'];
    const missingFields = requiredFields.filter(field => !event[field]);

    if (missingFields.length > 0) {
        throw new Error(`Event missing required fields: ${missingFields.join(', ')}`);
    }

    return {
        ...event,
        date: formatDate(event.date),
        time: formatTime(event.time),
        banner: event.banner || 'https://via.placeholder.com/400x250?text=Event+Banner',
        capacity: event.capacity || 100,
        registered: event.registered || 0
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatTime(timeString) {
    // Convert to standardized format HH:MM AM/PM
    return timeString;
}

// ============================================
// Caching (Optional but Recommended)
// ============================================

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

async function getCachedEvents() {
    const cached = cache.get('all_events');
    if (cached) {
        console.log('Returning cached events');
        return cached;
    }

    const events = await aggregateEventsFromClubs();
    cache.set('all_events', events);
    return events;
}

// ============================================
// Error Handling Middleware
// ============================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Chitkara Buzz API Server running on port ${PORT}`);
    console.log(`Events endpoint: http://localhost:${PORT}/api/events`);
});

// ============================================
// OPTION 2: Firebase Cloud Functions
// ============================================

/*
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.getAllEvents = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const events = await aggregateEvents();
      res.json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
*/

// ============================================
// OPTION 3: Netlify Functions
// ============================================

/*
// netlify/functions/get-events.js

exports.handler = async (event, context) => {
  try {
    const events = await aggregateEventsFromClubs();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, events })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
*/

// ============================================
// Setup Instructions
// ============================================

/*
SETUP:

1. Install dependencies:
   npm install express axios cors node-cache

2. Create .env file:
   PORT=3001
   NODE_ENV=development

3. Run the server:
   node server.js

4. Update Chitkara Buzz frontend:
   - Edit src/App.jsx
   - Change API endpoint to: http://localhost:3001/api/events
   - Or your production domain

5. Deploy to production:
   - Heroku: git push heroku main
   - AWS Lambda: serverless deploy
   - Google Cloud Run: gcloud run deploy
   - Railway: railway up
*/

// ============================================
// Example: How to structure club API
// ============================================

/*
Each club should expose an endpoint like:
GET /api/events

Response format:
{
  "events": [
    {
      "id": 1,
      "title": "Event Name",
      "category": "Technical",
      "date": "2026-02-20",
      "time": "10:00 AM",
      "location": "Hall Name",
      "banner": "https://image-url.jpg",
      "description": "Description",
      "registrationLink": "https://register.com",
      "capacity": 150,
      "registered": 89
    }
  ]
}
*/

module.exports = {
    aggregateEventsFromClubs,
    getEventsByClub,
    validateEventData
};
