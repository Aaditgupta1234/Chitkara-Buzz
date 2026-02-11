# 🔐 Chitkara Buzz - Admin System Guide

## Overview

The Admin System allows college administrators to register clubs and their websites. The system then automatically fetches events from these club websites and displays them on the Chitkara Buzz platform.

## Admin Login

### Access Admin Panel

Click the **🔐 Admin** button in the top-right corner of the header.

### Default Admin Credentials

```
Email: admin@chitkarabuzz.com
Password: ChitkaBuzz@2026
```

⚠️ **Important**: Change these credentials in production!

## Admin Dashboard Features

### 1. View Registered Clubs

Once logged in, you'll see:

- List of all registered clubs
- Club name, category, and website URL
- Date when each club was added
- Status indicator (Active)
- Delete button for removing clubs

### 2. Add a New Club

#### Steps to Add a Club:

1. Click **"+ Add New Club"** button
2. Fill in the form:
   - **Club Name** (Required) - E.g., "Code Crusaders"
   - **Website URL** (Required) - E.g., "https://codecrusaders.chitkara.edu.in"
   - **Category** (Required) - Choose from dropdown:
     - Technical
     - Business
     - Cultural
     - Sports
     - Arts
     - Competition
     - Other
   - **Description** (Optional) - Brief description of the club

3. Click **"Add Club"** button
4. The club will be added and events will be automatically fetched

### 3. Delete a Club

1. Find the club in the grid
2. Click the **✕** button on the top-right of the card
3. Confirm deletion (events from this club will be removed)

### 4. System Information

The right panel shows:

- **Total Clubs**: Number of registered clubs
- **Admin User**: Logged-in admin email
- **System Status**: Online/Offline indicator

## How Event Fetching Works

### Event Data Flow

```
Admin registers club website
        ↓
System connects to club website
        ↓
Fetches events from /api/events endpoint (or demo data)
        ↓
Events displayed on Chitkara Buzz
        ↓
Students see aggregated events from all clubs
```

### For Club Website Administrators

Your website should expose an API endpoint that returns events:

**Endpoint Format:**

```
GET /api/events
```

**Expected Response:**

```json
{
  "events": [
    {
      "id": 1,
      "title": "Event Name",
      "category": "Technical",
      "date": "2026-02-20",
      "time": "10:00 AM",
      "location": "Venue Name",
      "banner": "https://image-url.jpg",
      "description": "Event description",
      "registrationLink": "https://register-url.com",
      "capacity": 150,
      "registered": 89
    }
  ]
}
```

### Event Data Fields

| Field            | Type   | Required | Description                     |
| ---------------- | ------ | -------- | ------------------------------- |
| id               | number | ✓        | Unique event identifier         |
| title            | string | ✓        | Event name                      |
| category         | string | ✓        | Event type                      |
| date             | string | ✓        | YYYY-MM-DD format               |
| time             | string | ✓        | HH:MM AM/PM format              |
| location         | string | ✓        | Event venue                     |
| banner           | string | ✓        | Image URL (400x250 recommended) |
| description      | string | ✓        | Event details                   |
| registrationLink | string | ✓        | URL for registration            |
| capacity         | number | ✓        | Total seats available           |
| registered       | number | ✓        | Number of registrations         |

## Student Experience

### Viewing Events

Students see:

1. **Event Card** - Quick preview with:
   - Event image banner
   - Date and time
   - Club name
   - Event title
   - Location
   - Category tag
   - Occupancy status
2. **Click Banner** - Redirects to club website
3. **Click Card** - Opens detailed modal
4. **Details Modal** - Shows all information
5. **Register Now** - Redirects to registration link

### Filtering Events

Students can filter by:

- **Search** - Keywords in event name or description
- **Club** - Specific club dropdown
- **Category** - Event type dropdown

## Session Management

### Admin Token Storage

Admin sessions are stored in browser localStorage:

- `adminToken` - Authentication token
- `adminEmail` - Logged-in admin email

### Auto-Logout

Session persists while browser is open. Close browser or clear localStorage to logout.

### Manual Logout

Click **"Logout"** button in admin dashboard header.

## Data Storage

### Where Data is Stored

- **Registered Clubs** - Browser localStorage as JSON
- **Admin Session** - Browser localStorage
- **Event Cache** - Browser memory (reloaded on page refresh)

### Backup Registered Clubs

To backup your clubs:

```javascript
// In browser console:
console.log(localStorage.getItem("registeredClubs"));
```

### Restore Registered Clubs

```javascript
// Replace 'YOUR_FORMAT' with exported JSON
localStorage.setItem("registeredClubs", "YOUR_FORMAT");
```

## Integration Methods

### Method 1: Direct API Endpoint

Club website exposes `/api/events`:

```javascript
// Your club website backend
app.get("/api/events", (req, res) => {
  const events = [
    /* your events */
  ];
  res.json({ events });
});
```

### Method 2: Web Scraping

Use a backend service to scrape club websites:

```javascript
// Your backend scraper
app.get("/api/scrape-club/:clubId", async (req, res) => {
  const clubUrl = req.params.clubUrl;
  const events = await scrapeEventsFromWebsite(clubUrl);
  res.json({ events });
});
```

### Method 3: Database Connection

Connect directly to club database:

```javascript
const events = await ClubEvent.find({
  date: { $gte: new Date() },
});
res.json({ events });
```

## Troubleshooting

### Events Not Showing

**Problem**: After adding a club, events don't appear

**Solutions**:

1. Check club website URL is correct
2. Verify club website has `/api/events` endpoint
3. Check browser console for CORS errors
4. Ensure event data matches expected format

### Can't Login

**Problem**: Admin login fails

**Solutions**:

1. Check credentials: `admin@chitkarabuzz.com` / `ChitkaBuzz@2026`
2. Clear browser cache and cookies
3. Try incognito/private window
4. Verify JavaScript is enabled

### Club Deleted Accidentally

**Solution**: Add the club again. Previously fetched events are cleared.

### Performance Issues

**Problem**: Too many clubs/events causing slowness

**Solutions**:

1. Remove inactive clubs
2. Limit events shown per club
3. Implement pagination
4. Use caching on backend

## API Configuration

### Adding CORS Support (Backend)

If your club websites have CORS restrictions:

```javascript
// Your backend
const cors = require("cors");

app.use(
  cors({
    origin: "https://chitkarabuzz.chitkara.edu.in",
    credentials: true,
  }),
);
```

### Setting API Timeout

```javascript
const fetchEventsFromClub = async (clubWebsite) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(`${clubWebsite}/api/events`, {
      signal: controller.signal,
    });
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};
```

## Security Considerations

### For Admin

- ✅ Change default credentials immediately
- ✅ Use strong passwords
- ✅ Don't share credentials
- ✅ Logout after each session
- ✅ Enable 2FA (when available)

### For Club Websites

- ✅ Validate incoming requests
- ✅ Implement rate limiting
- ✅ Use HTTPS only
- ✅ Sanitize event data
- ✅ Implement authentication if needed

## Advanced Configuration

### Custom Event Formatting

Modify `src/utils/eventFetcher.js`:

```javascript
export const transformEventData = (rawEvent) => {
  return {
    id: rawEvent.event_id,
    title: rawEvent.event_name,
    category: rawEvent.event_type,
    // ... map your fields
  };
};
```

### Event Caching Strategy

```javascript
const CACHE_DURATION = 300000; // 5 minutes

export const getCachedEvents = async (clubWebsite) => {
  const cacheKey = `events_${clubWebsite}`;
  const cached = localStorage.getItem(cacheKey);
  const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);

  if (cached && Date.now() - timestamp < CACHE_DURATION) {
    return JSON.parse(cached);
  }

  const events = await fetchEventsFromClub(clubWebsite);
  localStorage.setItem(cacheKey, JSON.stringify(events));
  localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
  return events;
};
```

## Best Practices

### Admin Checklist

- [ ] Change default admin credentials
- [ ] Add all college clubs with correct URLs
- [ ] Test event fetching for each club
- [ ] Verify event banners load correctly
- [ ] Check occupancy calculations
- [ ] Test on mobile devices
- [ ] Monitor for broken links
- [ ] Regular backup of clubs list
- [ ] Update club URLs when they change
- [ ] Remove inactive clubs

### Club Website Checklist

- [ ] Implement `/api/events` endpoint
- [ ] Return data in correct format
- [ ] Set proper CORS headers
- [ ] Provide high-quality event images
- [ ] Keep registration links updated
- [ ] Test API regularly
- [ ] Document API changes
- [ ] Support pagination for large events
- [ ] Implement rate limiting
- [ ] Monitor API uptime

## FAQ

### Q: Can students register without leaving Chitkara Buzz?

**A:** Links redirect to club website for registration (as requested).

### Q: How often are events updated?

**A:** Events are fetched when admin adds club or page is refreshed. For real-time updates, add refresh feature.

### Q: Can multiple admins access the system?

**A:** Currently single admin. Backend required for multi-admin support.

### Q: What if a club website is down?

**A:** System shows cached events. Alert appears in admin panel.

### Q: Can I schedule automatic event updates?

**A:** Requires backend. Implement cron jobs to fetch events periodically.

### Q: How many clubs can be registered?

**A:** Unlimited. Performance depends on event volume.

### Q: Can I export events data?

**A:** Yes, through browser console or implement export feature.

## Customization

### Change Admin Credentials

Edit `src/components/AdminLogin.jsx`:

```javascript
const ADMIN_EMAIL = "your-email@college.edu";
const ADMIN_PASSWORD = "your-strong-password";
```

### Change Admin Color Theme

Edit `src/components/AdminDashboard.css`:

```css
.admin-header {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Customize Categories

Edit `src/components/AddClubForm.jsx`:

```javascript
const categories = [
  "Technical",
  "Business",
  "Your Category",
  "Another Category",
];
```

## Support & Help

- Check `README.md` for general documentation
- Review `IMPLEMENTATION_CHECKLIST.md` for setup
- See `BACKEND_EXAMPLE.js` for API implementation
- Check browser console for error messages

---

**Admin System Ready to Use!**

Login with demo credentials and start adding clubs!
