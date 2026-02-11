# ⚡ Chitkara Buzz - Quick Start Guide

## What You Have

A fully functional **College Events Aggregator** website built with:

- 🎨 **Modern Red & Purple Design** - Chitkara branding
- 📱 **Responsive UI** - Works on all devices
- 🔍 **Smart Search & Filters** - Find events easily
- 📋 **Event Details Modal** - Full event information
- 🎯 **Sample Data** - 8 events ready to display

## Website is Live! 🎉

The website is currently running at **http://localhost:5174/**

### What You Can Do Right Now:

1. **Browse Events** - See all 8 sample events from different clubs
2. **Search** - Type keywords to find events (e.g., "hackathon", "art")
3. **Filter by Club** - Select specific clubs from dropdown
4. **Filter by Category** - Choose event types (Technical, Business, etc.)
5. **View Details** - Click any event to see full information
6. **Register** - Links redirect to event registration pages
7. **Share** - Copy event links to clipboard

## File Structure

```
src/
├── App.jsx              ← Main component (edit for API integration)
├── App.css              ← Global styles
├── main.jsx            ← Entry point
├── integration-examples.js  ← 8 ways to connect to APIs
└── components/
    ├── Header.jsx      ← Logo and navigation
    ├── EventCard.jsx   ← Event preview cards
    ├── FilterBar.jsx   ← Search and filters
    └── EventModal.jsx  ← Detailed event view
```

## Next Steps

### Step 1: Test the Current Version (2 mins)

```bash
# Already running! Just visit:
http://localhost:5174
```

Try filtering, searching, and viewing event details.

### Step 2: Connect Real Data (15-30 mins)

Edit `src/App.jsx` line 20. Replace mock data with real API:

```javascript
// Option A: Single API endpoint
const response = await axios.get("https://your-college-api.com/events");

// Option B: Multiple club APIs (see integration-examples.js)
const [club1, club2, club3] = await Promise.all([
  axios.get("https://club1-api.com/events"),
  axios.get("https://club2-api.com/events"),
  axios.get("https://club3-api.com/events"),
]);
const allEvents = [...club1.data, ...club2.data, ...club3.data];

setEvents(allEvents);
setFilteredEvents(allEvents);
```

### Step 3: Deploy (Choose One)

**Easiest - Vercel (Free):**

```bash
npm install -g vercel
vercel
# Follow prompts - it's done!
```

**Or - Netlify (Free):**

```bash
npm run build
# Drag & drop the 'dist' folder to Netlify.com
```

**Or - Your Own Server:**

```bash
npm run build
# Upload 'dist' folder to your hosting
```

## Expected Event Format

Your API should return events like this:

```javascript
{
  id: 1,
  title: "Event Name",
  club: "Club Name",
  category: "Technical", // or Business, Sports, Cultural, Arts, Competition
  date: "2026-02-20",
  time: "10:00 AM",
  location: "Hall Name",
  banner: "https://image-url.jpg",
  description: "Event description...",
  registrationLink: "https://register-here.com",
  capacity: 150,
  registered: 89
}
```

## Customization (5 mins)

### Change Colors

Edit `src/components/Header.css`:

```css
.header {
  background: linear-gradient(135deg, #YourColor1 0%, #YourColor2 100%);
}
```

### Change Logo

Edit `src/components/Header.jsx`:

```jsx
<div className="logo">
  <img src="your-logo.png" alt="Chitkara Buzz" />
</div>
```

### Change Website Name

Edit `src/components/Header.jsx`:

```jsx
<h1>Your College Name Buzz</h1>
```

## Important Files to Know

| File                      | Purpose                                |
| ------------------------- | -------------------------------------- |
| `App.jsx`                 | Main app logic - **edit here for API** |
| `integration-examples.js` | 8 different API integration methods    |
| `DEPLOYMENT_GUIDE.md`     | Full deployment instructions           |
| `README.md`               | Detailed documentation                 |
| `.env.example`            | Configuration template                 |

## Common Questions

### Q: Can I use it right now without changing anything?

**A:** Yes! It has sample data built-in. Perfect for testing.

### Q: How do I add real college events?

**A:** Edit the `fetchAllEvents()` function in `App.jsx` to call your API instead of using mock data.

### Q: Does it work on mobile?

**A:** Yes! Fully responsive. Try accessing from your phone.

### Q: Can I host it for free?

**A:** Yes! Vercel, Netlify, or GitHub Pages all offer free hosting.

### Q: How do I make events update automatically?

**A:** See `pollForUpdates` function in `integration-examples.js`.

## Troubleshooting

**Website won't load?**

```bash
cd f:\College-Events-Aggregator
npm install
npm run dev
```

**Port 5174 issues?**

```bash
npm run dev -- --port 3000
```

**Changes not showing?**

- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Restart dev server

## What's Next?

1. ✅ Website is running
2. ⬜ Connect your event data source
3. ⬜ Customize colors and logo
4. ⬜ Deploy to production
5. ⬜ Share with students!

## Support Files

- **Detailed Setup**: See `DEPLOYMENT_GUIDE.md`
- **API Examples**: See `src/integration-examples.js`
- **Full Docs**: See `README.md`

---

**You're all set! The website is live and ready to be customized. 🚀**

Visit **http://localhost:5174/** to see it in action!
