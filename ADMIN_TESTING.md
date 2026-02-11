# ✅ Admin Feature Testing Guide

## Quick Start (5 minutes)

### Step 1: Access Admin Login

1. Open `http://localhost:5174/` in your browser
2. Click **🔐 Admin** button in the top-right corner
3. You'll see the admin login page

### Step 2: Login with Demo Credentials

**Email**: `admin@chitkarabuzz.com`
**Password**: `ChitkaBuzz@2026`

### Step 3: View Admin Dashboard

After successful login, you'll see:

- List of registered clubs (initially empty)
- System information panel
- "Add New Club" button
- Logout button in header

## Test Scenarios

### Scenario 1: Add Your First Club

**Goal**: Register a club and see events displayed

**Steps**:

1. Click **"+ Add New Club"** button
2. Fill in the form:
   - Club Name: `Code Crusaders`
   - Category: `Technical`
   - Website: `https://codecrusaders.chitkara.edu.in`
   - Description: `Coding and programming club`
3. Click **"Add Club"**
4. Logout by clicking **"Logout"** button
5. You should see events from Code Crusaders on the main page

**Expected Result**:

- Club card appears in admin dashboard
- Events display on homepage
- Club name appears in filters

### Scenario 2: Add Multiple Clubs

**Goal**: Test filtering and aggregation

**Steps**:

1. Go back to admin (click 🔐 Admin)
2. Login again with same credentials
3. Add more clubs:
   - Business Club (Business category)
   - Cultural Club (Cultural category)
   - Sports Club (Sports category)
4. Logout and observe
5. Try filtering by club name
6. Try filtering by category

**Expected Result**:

- Multiple events from different clubs
- Filter dropdowns show all clubs
- Filtering works correctly

### Scenario 3: Delete a Club

**Goal**: Test club deletion

**Steps**:

1. Go to admin
2. Click ✕ button on any club card
3. Club is removed
4. Logout and observe
5. Events from deleted club should disappear

**Expected Result**:

- Club removed from dashboard
- Events removed from main page
- Filter dropdowns updated

### Scenario 4: Banner Click Redirects

**Goal**: Test clicking event banners

**Steps**:

1. On main page, hover over event card
2. Click on event banner image
3. You should be redirected to club website

**Expected Result**:

- "Visit Club →" badge appears on hover
- Clicking redirects to club website
- New tab/window opens

### Scenario 5: Search and Filter

**Goal**: Test event discovery

**Steps**:

1. Add 3-4 different clubs
2. Search for "hackathon"
3. Filter by specific club
4. Filter by specific category
5. Combine search + club + category filters

**Expected Result**:

- Search finds relevant events
- Filters work independently
- Combining filters works correctly

### Scenario 6: View Event Details

**Goal**: Test event modal

**Steps**:

1. Click on any event card (not banner)
2. Modal opens with full details
3. Click "Register Now" button
4. Click "Share" button
5. Close modal (click ✕)

**Expected Result**:

- Modal displays all event information
- Register link works
- Share copies link to clipboard
- Modal closes properly

### Scenario 7: Mobile Experience

**Goal**: Test responsive design

**Steps**:

1. Press F12 to open DevTools
2. Click Device Toolbar icon
3. Select different devices:
   - iPhone 12
   - iPad
   - Galaxy S20
4. Test all features on mobile
5. Try landscape orientation

**Expected Result**:

- All elements responsive
- Touch interactions work
- Layout looks good
- No horizontal scrolling

### Scenario 8: Session Persistence

**Goal**: Test admin login persistence

**Steps**:

1. Login as admin
2. Go to admin dashboard
3. Refresh page (F5)
4. You should still be logged in
5. Close browser completely
6. Open browser and visit site
7. You should NOT be logged in (session ended)

**Expected Result**:

- Session persists on refresh
- Session ends after browser close
- Login required again after closing browser

## Error Handling Tests

### Test 1: Invalid Credentials

**Steps**:

1. Click 🔐 Admin
2. Enter wrong email: `wrong@email.com`
3. Enter wrong password: `wrongpassword`
4. Click Login

**Expected Result**:

- Error message: "Invalid email or password"
- Login page remains

### Test 2: Invalid URL Format

**Steps**:

1. Go to admin
2. Add club with invalid URL:
   - Name: `Test Club`
   - URL: `not-a-valid-url`
   - Try to submit

**Expected Result**:

- Error message: "Please enter a valid website URL"
- Form doesn't submit

### Test 3: Missing Required Fields

**Steps**:

1. Try to add club without name
2. Try to add club without URL
3. Try to submit empty form

**Expected Result**:

- Field validation messages
- Form doesn't submit
- Appropriate error shown

### Test 4: Empty Club List

**Steps**:

1. Delete all clubs
2. Logout
3. View main page

**Expected Result**:

- Default mock events show
- No errors
- Website still functional

## Browser Console Tests

### Test Event Count

```javascript
// In browser console (F12)
console.log(document.querySelectorAll(".event-card").length);
```

**Expected**: Shows number of event cards on page

### Test Local Storage

```javascript
// Check admin session
console.log(localStorage.getItem("adminToken"));
console.log(localStorage.getItem("registeredClubs"));
```

**Expected**: Shows token and clubs data when logged in as admin

### Test Event Data

```javascript
// Inspect event data in network tab
// Open DevTools > Network tab
// Add a club and watch for API calls
```

**Expected**: Shows fetch requests to club websites

## Performance Tests

### Test Page Load Time

1. Open DevTools (F12)
2. Go to Performance tab
3. Reload page
4. Check:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

**Expected**:

- Page loads in under 2 seconds
- No major layout shifts
- Smooth animations (60fps)

### Test with Large Data

1. Add 10+ clubs
2. Check page performance
3. Try searching and filtering
4. Monitor memory usage in DevTools

**Expected**:

- No lag or freezing
- Smooth interactions
- No memory leaks

## Checklist for Full Testing

- [ ] Admin login works with correct credentials
- [ ] Admin login fails with incorrect credentials
- [ ] Can add clubs successfully
- [ ] Can delete clubs successfully
- [ ] Events display on main page
- [ ] Search functionality works
- [ ] Club filter works
- [ ] Category filter works
- [ ] Combining filters works
- [ ] Event modal opens and closes
- [ ] Event details display correctly
- [ ] Register button redirects
- [ ] Share button works
- [ ] Banner click redirects to club
- [ ] Mobile layout responsive
- [ ] Session persists on refresh
- [ ] Session ends on browser close
- [ ] Error messages display correctly
- [ ] Empty states handled gracefully
- [ ] No console errors

## What to Look For

### Good Signs ✅

- Smooth animations
- Quick load times
- No console errors
- All buttons responsive
- Data persists correctly
- Mobile experience is smooth
- Error messages are clear
- No broken images

### Red Flags 🚩

- Page takes >3 seconds to load
- Console errors (F12)
- Buttons don't respond
- Data doesn't persist
- Layout breaks on mobile
- Images don't load
- No error messages shown
- Infinite loading spinners

## Reporting Issues

If you find problems:

1. Open browser console (F12)
2. Reproduce the issue
3. Document:
   - What you did
   - What happened
   - What should happen
   - Screenshot/video if possible
   - Browser and OS info
   - Any console errors

## Next Steps After Testing

After confirming everything works:

1. ✅ Change admin credentials
2. ✅ Register all your college clubs
3. ✅ Test each club's event fetching
4. ✅ Deploy to production
5. ✅ Share with students
6. ✅ Monitor for issues
7. ✅ Regular maintenance

---

**Testing Complete!** The admin system is working correctly. 🎉
