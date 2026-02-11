# 🚀 Real Event Fetching Setup Guide

This guide explains how to fetch **real** events from club websites.

## Architecture

The system now has two parts:

1. **Frontend** (React + Vite) - Running on `localhost:5174`
2. **Backend** (Node.js + Express) - Running on `localhost:5000`

The backend handles:

- ✅ Fetching events from club websites
- ✅ Parsing JSON or HTML content
- ✅ Handling CORS issues
- ✅ Scraping event data from websites

## Setup Instructions

### Step 1: Install Backend Dependencies

Navigate to the project folder and install backend dependencies:

```bash
npm install express cors axios cheerio
```

Or rename `server-package.json` to `package.json` and run in a separate folder.

### Step 2: Start the Backend Server

In a **new terminal**, run:

```bash
node server.js
```

You should see:

```
🚀 Event Fetcher Server running on http://localhost:5000
📡 POST /api/fetch-events - Fetch events from a club website
```

### Step 3: Start the Frontend (if not already running)

In another terminal, run:

```bash
npm run dev
```

Frontend will run on `http://localhost:5174`

### Step 4: Test Real Event Fetching

1. Go to Admin Panel (🔐 Admin)
2. Login with: `admin@chitkarabuzz.com` / `ChitkaBuzz@2026`
3. Add a test club:
   - **Name**: `Test Club`
   - **Category**: `Technical`
   - **Website**: `https://example.com` (or any URL with event data)

4. Logout and check Events section
5. The system will now try to:
   - Fetch events from that website
   - Parse JSON or HTML
   - Display real events if available
   - Show demo events if fetch fails

## Website Format Support

The backend can parse events from websites in these formats:

### Option 1: JSON API Endpoint

If your club website has an API endpoint at `/api/events` that returns:

```json
[
  {
    "title": "Event Name",
    "date": "2026-02-20",
    "time": "10:00 AM",
    "location": "Venue",
    "description": "Event details",
    "category": "Technical"
  }
]
```

The system will automatically parse this! ✅

### Option 2: HTML Website

If your website is HTML-based, the server will:

1. Scrape the page
2. Look for common event patterns
3. Extract title, date, location, description
4. Display the parsed events ✅

### Option 3: Custom Format

To support custom formats, modify the `parseJsonEvents` and `scrapeHtmlEvents` functions in `server.js`.

## Expected Event Format

Events should have these fields:

```javascript
{
  title: "Event Name",           // Required
  date: "2026-02-20",            // Required (YYYY-MM-DD)
  time: "10:00 AM",              // Optional
  location: "Venue Name",        // Optional
  description: "Details",        // Optional
  category: "Technical",         // Optional
  banner: "image-url.jpg",       // Optional
  registrationLink: "url",       // Optional
  capacity: 100,                 // Optional
  registered: 50                 // Optional
}
```

## Testing with Sample Clubs

Here are URLs you can test with:

1. **JSON API Test**: Create a simple JSON file and serve it

   ```url
   http://localhost:3000/events.json
   ```

2. **Your Club Website**: Add your actual club website URL

3. **Example Format**:
   ```
   https://myclub.com/events
   ```

## Troubleshooting

### ❌ "Could not fetch real events"

This means either:

1. The website is unreachable
2. The website structure doesn't match expected patterns
3. Backend server is not running

**Solution**: Check that `node server.js` is running on port 5000

### ❌ Demo events showing instead

This is the **fallback behavior** - it's working as intended!

When the system can't fetch real events, it automatically generates demo events so your site still works.

### ✅ How to verify it's working

1. Open browser console (F12)
2. Check for messages like:
   - `✓ Fetched 3 events from Test Club` - Success!
   - `Failed to fetch from backend` - Check if backend is running

## Customizing Event Parsing

To customize how events are extracted from club websites:

Edit `server.js`, specifically the `scrapeHtmlEvents` function:

```javascript
export function scrapeHtmlEvents(html, clubUrl, clubName) {
  // Customize selectors based on your club websites
  // Example: $('[class*="event-item"]')
}
```

## Production Deployment

When deploying to production:

1. **Backend**: Deploy `server.js` to a service like:
   - Heroku
   - Railway
   - AWS-Lambda
   - DigitalOcean

2. **Update BACKEND_URL** in `src/utils/eventFetcher.js`:

   ```javascript
   const BACKEND_URL = "https://your-deployed-backend.com";
   ```

3. **Frontend**: Deploy React app to:
   - Vercel
   - Netlify
   - GitHub Pages

## Running Both Servers Together

**Option 1: Two Terminals**

```bash
# Terminal 1: Backend
node server.js

# Terminal 2: Frontend
npm run dev
```

**Option 2: Concurrently Package**

```bash
npm install -g concurrently

# In a new package.json
"scripts": {
  "dev": "concurrently \"node server.js\" \"vite\""
}
```

## Next Steps

1. ✅ Start backend: `node server.js`
2. ✅ Start frontend: `npm run dev`
3. ✅ Go to admin and add test club
4. ✅ Watch events get fetched automatically
5. ✅ Deploy both to production

---

**Issues or questions?** Check the browser console and server logs for detailed error messages!
