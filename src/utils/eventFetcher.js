/**
 * Event Scraping & Fetching Utility
 * Handles fetching events from registered club websites
 */

// Backend server URL (change this to your deployed server)
const BACKEND_URL = 'http://localhost:5000';

export const fetchEventsFromClub = async (clubWebsite, clubName) => {
    try {
        // Try to fetch from backend server
        const response = await fetch(`${BACKEND_URL}/api/fetch-events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clubUrl: clubWebsite,
                clubName: clubName
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✓ Fetched ${data.count} events from ${clubName}`);
            return data.events || [];
        }
    } catch (error) {
        console.warn(`Failed to fetch from backend for ${clubName}:`, error);
    }

    // Fallback: return empty array
    return [];
}

export const fetchEventsFromAllClubs = async (clubs) => {
    if (!clubs || clubs.length === 0) {
        return []
    }

    const promises = clubs.map(async (club) => {
        try {
            const events = await fetchEventsFromClub(club.website)
            return events.map(event => ({
                ...event,
                club: club.name,
                clubWebsite: club.website,
                clubCategory: club.category,
                id: event.id || `${club.id}-${Math.random()}`
            }))
        } catch (error) {
            console.warn(`Error fetching from ${club.name}:`, error)
            return []
        }
    })

    const results = await Promise.allSettled(promises)
    const allEvents = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value || [])

    return allEvents
}

/**
 * Demo Function: Generate sample events for testing
 * In production, this would be replaced with real event fetching
 */
export const generateDemoEventsForClub = (club) => {
    const demoEvents = {
        'Code Crusaders': [
            {
                id: `${club.id}-1`,
                title: 'Hackathon 2026',
                category: 'Technical',
                date: '2026-02-20',
                time: '10:00 AM',
                location: 'Main Auditorium',
                banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
                description: 'Join us for an exciting 24-hour hackathon with amazing prizes.',
                registrationLink: `${club.website}/register/hackathon`,
                capacity: 150,
                registered: 89,
                club: club.name,
                clubWebsite: club.website
            }
        ],
        'Business Club': [
            {
                id: `${club.id}-2`,
                title: 'Investment Summit',
                category: 'Business',
                date: '2026-02-22',
                time: '2:00 PM',
                location: 'Conference Room A',
                banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
                description: 'Learn from industry experts about investment strategies.',
                registrationLink: `${club.website}/register/summit`,
                capacity: 100,
                registered: 67,
                club: club.name,
                clubWebsite: club.website
            }
        ],
        'Cultural Club': [
            {
                id: `${club.id}-3`,
                title: 'Cultural Fest: Colors of India',
                category: 'Cultural',
                date: '2026-02-25',
                time: '6:00 PM',
                location: 'Open Ground',
                banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
                description: 'Celebrate the vibrant culture with traditional dance and music.',
                registrationLink: `${club.website}/register/culturalfest`,
                capacity: 500,
                registered: 234,
                club: club.name,
                clubWebsite: club.website
            }
        ],
        'Sports Club': [
            {
                id: `${club.id}-4`,
                title: 'Cricket League Tournament',
                category: 'Sports',
                date: '2026-03-01',
                time: '3:00 PM',
                location: 'Cricket Ground',
                banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop',
                description: 'Inter-departmental cricket tournament with exciting matches.',
                registrationLink: `${club.website}/register/cricket`,
                capacity: 200,
                registered: 142,
                club: club.name,
                clubWebsite: club.website
            }
        ],
        'Art & Design Club': [
            {
                id: `${club.id}-5`,
                title: 'Art Exhibition: Student Showcase',
                category: 'Arts',
                date: '2026-02-28',
                time: '5:30 PM',
                location: 'Central Gallery',
                banner: 'https://images.unsplash.com/photo-1460661152884-922fd5212272?w=400&h=250&fit=crop',
                description: 'Amazing artworks created by talented students.',
                registrationLink: `${club.website}/register/artexhibition`,
                capacity: 300,
                registered: 189,
                club: club.name,
                clubWebsite: club.website
            }
        ]
    }

    // If club has predefined events, return them
    if (demoEvents[club.name]) {
        return demoEvents[club.name]
    }

    // FALLBACK: Generate generic events for any new club
    const genericEvents = [
        {
            id: `${club.id}-1`,
            title: `${club.name} Event - ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
            category: club.category || 'General',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00 AM',
            location: 'Event Venue',
            banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
            description: `Join ${club.name} for an exciting event. More details coming soon!`,
            registrationLink: `${club.website}/register`,
            capacity: 100,
            registered: 45,
            club: club.name,
            clubWebsite: club.website
        },
        {
            id: `${club.id}-2`,
            title: `${club.name} Workshop`,
            category: club.category || 'General',
            date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '2:00 PM',
            location: 'Workshop Hall',
            banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
            description: `Attend a workshop organized by ${club.name}. Learn new skills and network with fellow students.`,
            registrationLink: `${club.website}/register`,
            capacity: 80,
            registered: 52,
            club: club.name,
            clubWebsite: club.website
        }
    ]

    return genericEvents
}

/**
 * Format and validate event data
 */
export const validateEventData = (event) => {
    return {
        id: event.id || Math.random().toString(),
        title: event.title || 'Untitled Event',
        category: event.category || 'Other',
        date: event.date || new Date().toISOString().split('T')[0],
        time: event.time || '10:00 AM',
        location: event.location || 'TBD',
        banner: event.banner || 'https://via.placeholder.com/400x250?text=Event',
        description: event.description || 'Event details coming soon',
        registrationLink: event.registrationLink || '#',
        capacity: event.capacity || 100,
        registered: event.registered || 0,
        club: event.club || 'Unknown Club',
        clubWebsite: event.clubWebsite || '#'
    }
}

export default {
    fetchEventsFromClub,
    fetchEventsFromAllClubs,
    generateDemoEventsForClub,
    validateEventData
}
