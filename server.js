/**
 * Simple Backend Server for Event Fetching
 * Helps with CORS issues and website scraping
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'college_events',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
});

app.use(cors());
app.use(express.json());

// ==================== AUTH MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ==================== STUDENT AUTH ROUTES ====================

/**
 * Student Registration
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { rollNumber, email, password, name, department, year } = req.body;

        // Validation
        if (!rollNumber || !email || !password || !name) {
            return res.status(400).json({ error: 'Roll number, email, password, and name are required' });
        }

        // Check if student already exists
        const existingStudent = await pool.query(
            'SELECT * FROM students WHERE roll_number = $1 OR email = $2',
            [rollNumber, email]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(400).json({ error: 'Student with this roll number or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert student
        const result = await pool.query(
            `INSERT INTO students (roll_number, email, password, name, department, year) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, roll_number, email, name, department, year, created_at`,
            [rollNumber, email, hashedPassword, name, department || null, year || null]
        );

        const student = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { id: student.id, rollNumber: student.roll_number, email: student.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            student: {
                id: student.id,
                rollNumber: student.roll_number,
                email: student.email,
                name: student.name,
                department: student.department,
                year: student.year
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

/**
 * Student Login
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { rollNumber, email, password } = req.body;

        // Validation
        if ((!rollNumber && !email) || !password) {
            return res.status(400).json({ error: 'Roll number or email, and password are required' });
        }

        // Find student
        const result = await pool.query(
            'SELECT * FROM students WHERE roll_number = $1 OR email = $2',
            [rollNumber || '', email || '']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const student = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: student.id, rollNumber: student.roll_number, email: student.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            student: {
                id: student.id,
                rollNumber: student.roll_number,
                email: student.email,
                name: student.name,
                department: student.department,
                year: student.year
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

/**
 * Get current student profile
 */
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, roll_number, email, name, department, year, created_at FROM students WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = result.rows[0];
        res.json({
            id: student.id,
            rollNumber: student.roll_number,
            email: student.email,
            name: student.name,
            department: student.department,
            year: student.year,
            createdAt: student.created_at
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

/**
 * Register for an event
 */
app.post('/api/events/register', authenticateToken, async (req, res) => {
    try {
        const { eventId, eventTitle } = req.body;

        if (!eventId || !eventTitle) {
            return res.status(400).json({ error: 'Event ID and title are required' });
        }

        // Check if already registered
        const existing = await pool.query(
            'SELECT * FROM event_registrations WHERE student_id = $1 AND event_id = $2',
            [req.user.id, eventId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        // Register for event
        await pool.query(
            'INSERT INTO event_registrations (student_id, event_id, event_title) VALUES ($1, $2, $3)',
            [req.user.id, eventId, eventTitle]
        );

        res.json({ message: 'Successfully registered for event' });
    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({ error: 'Failed to register for event' });
    }
});

/**
 * Get student's registered events
 */
app.get('/api/events/my-registrations', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT event_id, event_title, registered_at FROM event_registrations WHERE student_id = $1 ORDER BY registered_at DESC',
            [req.user.id]
        );

        res.json(result.rows.map(row => ({
            eventId: row.event_id,
            eventTitle: row.event_title,
            registeredAt: row.registered_at
        })));
    } catch (error) {
        console.error('Fetch registrations error:', error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

// ==================== EXISTING EVENT ROUTES ====================

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
