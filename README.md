# 🎉 Chitkara Buzz - College Events Hub

Chitkara Buzz is a centralized platform that aggregates all upcoming college events from various student clubs and departments. Students can discover, filter, and register for events happening across the college.

## 🌟 Features

- **Event Aggregation**: Fetch and display events from multiple club sources
- **Smart Filtering**: Filter events by category, club, or search keywords
- **Event Details**: View comprehensive event information including date, time, location, capacity, and registration link
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Events are fetched dynamically from various sources
- **Beautiful UI**: Modern gradients, animations, and smooth interactions

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: CSS3 with modern gradients and animations
- **HTTP Client**: Axios for API calls
- **Routing**: React Router DOM (ready for expansion)

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Global styles
├── main.jsx               # React entry point
└── components/
    ├── Header.jsx         # Navigation header with logo
    ├── Header.css
    ├── EventCard.jsx      # Individual event card component
    ├── EventCard.css
    ├── FilterBar.jsx      # Search and filter controls
    ├── FilterBar.css
    ├── EventModal.jsx     # Event details modal
    └── EventModal.css
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173/`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Event Data Structure

Each event in the system has the following structure:

```javascript
{
  id: 1,
  title: "Event Name",
  club: "Club Name",
  category: "Technical|Business|Cultural|Sports|Arts|Competition",
  date: "2026-02-20",
  time: "10:00 AM",
  location: "Event Location",
  banner: "https://image-url.com/image.jpg",
  description: "Detailed description of the event",
  registrationLink: "https://registration-url.com",
  capacity: 150,
  registered: 89
}
```

## 🔌 Integration Guide: Connecting Real Data Sources

### Option 1: Club Website APIs

Each club website should expose an endpoint that returns events in the format above. Update the `fetchAllEvents()` function in `App.jsx`:

```javascript
const fetchAllEvents = async () => {
  try {
    // Fetch from multiple club endpoints
    const [clubAEvents, clubBEvents, clubCEvents] = await Promise.all([
      axios.get("https://club-a-website.com/api/events"),
      axios.get("https://club-b-website.com/api/events"),
      axios.get("https://club-c-website.com/api/events"),
    ]);

    const allEvents = [
      ...clubAEvents.data,
      ...clubBEvents.data,
      ...clubCEvents.data,
    ];

    setEvents(allEvents);
    setFilteredEvents(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
```

### Option 2: Central College API

If there's a main college platform that already aggregates events:

```javascript
const fetchAllEvents = async () => {
  try {
    const response = await axios.get(
      "https://college-main-website.com/api/all-events",
    );
    setEvents(response.data);
    setFilteredEvents(response.data);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
```

### Option 3: Database Backend

Create a backend service to manage event data:

```javascript
const fetchAllEvents = async () => {
  try {
    const response = await axios.get("https://your-backend-api.com/api/events");
    setEvents(response.data);
    setFilteredEvents(response.data);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
```

## 🎨 Customization

### Colors

Update the primary color scheme in CSS files:

- Primary (Red): `#d32f2f` (Header and accents)
- Secondary (Purple): `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (Buttons and highlights)

### Logo

The logo is an SVG nested square design. To change to your own image, edit `src/components/Header.jsx` and replace the SVG with:

```javascript
<div className="logo">
  <img src="path/to/your-logo.png" alt="Chitkara Buzz" />
</div>
```

## 📱 Responsive Breakpoints

- **Desktop**: Full grid layout (3+ columns)
- **Tablet**: 2-column grid (768px and below)
- **Mobile**: 1-column layout (320px and above)

## 🔒 Security Considerations

- Validate all event data from external sources
- Use CORS headers appropriately on backend
- Sanitize external links before rendering
- Implement rate limiting on API endpoints
- Use HTTPS for all API communications

## 📲 How It Works

1. **Fetch Phase**: Events are fetched from configured sources when the app loads
2. **Filter Phase**: Events are displayed and can be filtered by:
   - Search keywords (title/description)
   - Club/Organization
   - Event category
3. **Display Phase**: Events shown as cards with key information
4. **Details Phase**: Click any event to see full details and register

## 🤝 Contributing

To add new features or components:

1. Create components in `src/components/` folder
2. Add corresponding CSS file with same naming convention
3. Import and integrate into parent components
4. Update the README with new features

## 📊 Future Enhancements

- [ ] Event calendar view
- [ ] User accounts and saved events
- [ ] Email notifications for new events
- [ ] QR code check-in system
- [ ] Event ratings and reviews
- [ ] Social media sharing
- [ ] Admin panel for event management

## 📞 Support

For issues or feature requests, please contact the development team.

## 📄 License

This project is part of Chitkara University's college event management initiative.

---

**Made with ❤️ for Chitkara University**
