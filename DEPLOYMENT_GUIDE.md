# Chitkara Buzz - Deployment & Setup Guide

## 🎯 Project Summary

Chitkara Buzz is a fully functional React-based event aggregation platform built with:

- **Modern UI** with Chitkara's red branding
- **Real-time event filtering** by club, category, and search
- **Responsive design** for all devices
- **Event details modal** with registration links
- **Sample data** with 8 events from different clubs

## 📦 What's Included

### Components Built

✅ Header with logo and navigation
✅ Event Card displaying event preview
✅ Filter Bar for search and categorization
✅ Event Modal for detailed view
✅ Full CSS styling with animations

### Features Implemented

✅ Search events by keyword
✅ Filter by club/organization
✅ Filter by event category
✅ Event details modal
✅ Registration redirection
✅ Occupancy tracking
✅ Share functionality
✅ Responsive mobile design

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

```bash
# 1. Navigate to the project directory
cd f:\College-Events-Aggregator

# 2. Install dependencies
npm install

# 3. Create .env file (optional)
copy .env.example .env

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173/` (or the next available port)

## 🔗 Connecting Real Data Sources

### Quick Start (Immediate)

The app currently uses **mock data** with 8 sample events. This is perfect for testing and demonstration.

### Integration Steps

1. **Prepare API Endpoints**
   - Collect event data from all club websites
   - Create a central API endpoint or collect individual URLs

2. **Choose Integration Method**
   - See `src/integration-examples.js` for different approaches

3. **Update App.jsx**

   ```javascript
   // Replace the mock data in fetchAllEvents() with your API call
   const response = await axios.get("YOUR_API_ENDPOINT");
   setEvents(response.data);
   ```

4. **Test the Integration**
   ```bash
   npm run dev
   ```

## 📱 Deployment Options

### Option 1: Vercel (Recommended for Free Hosting)

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Option 3: GitHub Pages

1. Update `vite.config.js`:

```javascript
export default {
  base: "/Chitkara-Buzz/",
  plugins: [react()],
};
```

2. Push to GitHub
3. Enable GitHub Pages in repository settings

### Option 4: Traditional Hosting (Apache, Nginx, etc.)

```bash
npm run build
# Upload contents of 'dist' folder to your web server
```

### Option 5: Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```
REACT_APP_API_URL=https://your-api.com
REACT_APP_API_KEY=your_key_here
```

### Customizing Colors

Edit the gradient colors in CSS files:

- **Primary Red**: `#d32f2f`
- **Secondary Purple**: `#667eea` to `#764ba2`

### Changing the Logo

Replace SVG in `src/components/Header.jsx` with your image path.

## 🧪 Testing

### Local Testing

```bash
npm run dev
# Visit http://localhost:5173
# Test all filters and event details
```

### Production Build

```bash
npm run build
npm run preview
```

## 📋 API Data Format Expected

Your API should return events in this format:

```json
{
  "events": [
    {
      "id": 1,
      "title": "Event Name",
      "club": "Club Name",
      "category": "Technical",
      "date": "2026-02-20",
      "time": "10:00 AM",
      "location": "Hall Name",
      "banner": "https://image-url.jpg",
      "description": "Event description",
      "registrationLink": "https://registration-url.com",
      "capacity": 150,
      "registered": 89
    }
  ]
}
```

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

### Dependency Issues

```bash
# Clear and reinstall
rm -r node_modules package-lock.json
npm install
```

### API Connection Errors

1. Check CORS settings on backend
2. Verify API endpoint is accessible
3. Check browser console for detailed errors
4. Enable `REACT_APP_DEBUG_MODE=true` in .env

## 📊 Analytics & Monitoring

Consider adding:

- Google Analytics for event view tracking
- Error monitoring (Sentry, LogRocket)
- Performance monitoring with Web Vitals

## 🔐 Security Checklist

- [ ] Enable HTTPS in production
- [ ] Set appropriate CORS headers
- [ ] Validate event data on frontend
- [ ] Sanitize external URLs
- [ ] Implement rate limiting on API
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates

## 📚 Documentation Files

- `README.md` - Project overview and features
- `integration-examples.js` - 8 different API integration methods
- `.env.example` - Configuration template
- This file - Deployment guide

## 💡 Next Steps

1. **Setup your API endpoint** - Collect events from club websites
2. **Test with mock data** - Ensure UI works as expected
3. **Integrate real data** - Connect to actual club APIs
4. **Deploy to production** - Choose your hosting platform
5. **Monitor and update** - Add new events, features, improvements

## 🤝 Support & Maintenance

### Regular Updates

```bash
npm update
npm audit
npm audit fix
```

### Adding New Features

See the components structure and add new components following the same pattern.

### Performance Optimization

- Lazy load event images
- Implement pagination for large event lists
- Cache API responses
- Use React.memo for event cards

## 📞 Contact

For setup assistance or feature requests, contact your development team.

---

**Chitkara Buzz v1.0**
_Making college connections, one event at a time!_
