/**
 * Simple Backend Server for Event Fetching
 * Helps with CORS issues and website scraping
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/**
 * Parse events from JSON format
 */
function parseJsonEvents(data, clubUrl, clubName) {
    if (Array.isArray(data)) {
        return data.map((event, index) => ({
            id: `${clubName}-${index}-${Date.now()}`,
            title: event.title || event.name || 'Untitled Event',
            date: event.date || event.eventDate || new Date().toISOString().split('T')[0],
            time: event.time || event.eventTime || '10:00 AM',
            location: event.location || event.venue || 'TBD',
            description: event.description || event.details || '',
            banner: event.banner || event.image || event.thumbnail || 'https://via.placeholder.com/400x250?text=Event',
            registrationLink: event.registrationLink || event.registerUrl || clubUrl,
            capacity: event.capacity || 100,
            registered: event.registered || 0,
            category: event.category || 'General',
            club: clubName,
            clubWebsite: clubUrl
        }));
    }
    return [];
}

/**
 * Scrape events from HTML page (basic implementation)
 */
async function scrapeHtmlEvents(html, clubUrl, clubName) {
    const $ = cheerio.load(html);
    const events = [];

    // Look for common event patterns
    // This is a basic implementation - customize based on your club websites

    $('[class*="event"], [id*="event"], article').each((i, elem) => {
        const eventElement = $(elem);
        const title = eventElement.find('[class*="title"], [class*="name"], h2, h3').first().text().trim();
        const date = eventElement.find('[class*="date"], [class*="time"]').first().text().trim();
        const location = eventElement.find('[class*="location"], [class*="venue"]').first().text().trim();
        const description = eventElement.find('[class*="description"], [class*="details"], p').first().text().trim();
        const link = eventElement.find('a').first().attr('href');

        if (title && date) {
            events.push({
                id: `${clubName}-${i}-${Date.now()}`,
                title: title || 'Untitled Event',
                date: date || new Date().toISOString().split('T')[0],
                time: '10:00 AM',
                location: location || 'TBD',
                description: description || '',
                banner: 'https://via.placeholder.com/400x250?text=Event',
                registrationLink: link || clubUrl,
                capacity: 100,
                registered: Math.floor(Math.random() * 50),
                category: 'General',
                club: clubName,
                clubWebsite: clubUrl
            });
        }
    });

    return events.length > 0 ? events : [];
}

/**
 * Main endpoint to fetch events from a club website
 */
app.post('/api/fetch-events', async (req, res) => {
    try {
        const { clubUrl, clubName } = req.body;

        if (!clubUrl || !clubName) {
            return res.status(400).json({
                success: false,
                error: 'clubUrl and clubName are required'
            });
        }

        // Ensure URL has protocol
        let url = clubUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        console.log(`Fetching events from: ${url}`);

        // Try to fetch from the club website
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        let events = [];
        const contentType = response.headers['content-type'];

        // Check if response is JSON
        if (contentType && contentType.includes('application/json')) {
            try {
                const jsonData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                events = parseJsonEvents(jsonData, clubUrl, clubName);
            } catch (e) {
                console.log('Failed to parse as JSON, trying HTML scraping...');
                events = await scrapeHtmlEvents(response.data, clubUrl, clubName);
            }
        } else {
            // Try HTML scraping
            events = await scrapeHtmlEvents(response.data, clubUrl, clubName);
        }

        res.json({
            success: true,
            events: events,
            count: events.length,
            source: events.length > 0 ? 'fetched' : 'empty'
        });

    } catch (error) {
        console.error('Error fetching events:', error.message);

        res.status(200).json({
            success: false,
            events: [],
            count: 0,
            source: 'error',
            message: `Could not fetch events from website. Error: ${error.message}`
        });
    }
});

/**
 * Generate demo events (fallback)
 */
function generateDemoEvents(clubName, clubUrl) {
    return [
        {
            id: `${clubName}-1-${Date.now()}`,
            title: `${clubName} Main Event`,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00 AM',
            location: 'Event Venue',
            description: `Join ${clubName} for an amazing event!`,
            banner: 'https://via.placeholder.com/400x250?text=Event',
            registrationLink: clubUrl,
            capacity: 100,
            registered: Math.floor(Math.random() * 50),
            category: 'General',
            club: clubName,
            clubWebsite: clubUrl
        },
        {
            id: `${clubName}-2-${Date.now()}`,
            title: `${clubName} Workshop`,
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '2:00 PM',
            location: 'Workshop Hall',
            description: `Learn from experts at ${clubName} workshop.`,
            banner: 'https://via.placeholder.com/400x250?text=Workshop',
            registrationLink: clubUrl,
            capacity: 80,
            registered: Math.floor(Math.random() * 40),
            category: 'General',
            club: clubName,
            clubWebsite: clubUrl
        }
    ];
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Event Fetcher Server running on http://localhost:${PORT}`);
    console.log(`📡 POST /api/fetch-events - Fetch events from a club website`);
});
