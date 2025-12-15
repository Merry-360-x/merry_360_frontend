# Merry360X Complete System Testing Guide

**Date:** December 15, 2025  
**Tester:** System Testing  
**Version:** MVP 1.0

## Test Environment
- **Application URL:** http://localhost:5174
- **Browser:** Chrome/Safari/Firefox
- **Operating System:** macOS

---

## Test Scenario 1: Host/Vendor Workflow

### 1.1 Create Vendor Account
**Objective:** Register as a new host/vendor

**Steps:**
1. Navigate to http://localhost:5174
2. Click "Signup" in the header
3. Fill in registration form:
   - Full Name: "John Host"
   - Email: "host@test.com"
   - Phone: "+250 788 123 456"
   - Password: "password123"
   - Confirm Password: "password123"
4. Check "I agree to the Terms of Service and Privacy Policy"
5. Click "Sign Up"
6. Verify successful redirect to profile page

**Expected Result:**
- User successfully registered
- Redirected to /profile or /dashboard
- User stored in localStorage

**Test Data:**
```json
{
  "fullName": "John Host",
  "email": "host@test.com",
  "phone": "+250 788 123 456",
  "password": "password123",
  "role": "user"
}
```

---

### 1.2 Navigate to Become a Host
**Objective:** Access host registration page

**Steps:**
1. From header, click "Become a Host"
2. Or navigate to: http://localhost:5174/become-host
3. Scroll through benefits section
4. Click "Get Started Today" button

**Expected Result:**
- Benefits displayed correctly
- Form section visible
- Dark mode styles working

---

### 1.3 Access Vendor Dashboard
**Objective:** Login and access vendor portal

**Steps:**
1. If not logged in, click "Login"
2. Enter credentials:
   - Email: "host@test.com"
   - Password: "password123"
3. Click "Sign In"
4. Navigate to: http://localhost:5174/vendor

**Expected Result:**
- Successfully logged in
- Vendor dashboard loads
- Stats displayed (Bookings, Revenue, Rating, Properties)
- Sidebar menu visible

**Note:** In production, user role should be upgraded to "vendor". For testing, manually access /vendor route.

---

### 1.4 Create Property Listing
**Objective:** Add a new property with images

**Steps:**
1. On Vendor Dashboard, click "Add New Listing" button
2. Verify redirect to /vendor/create-property
3. Fill in Basic Information:
   - Property Name: "Sunrise Villa Kigali"
   - Property Type: "Hotel"
   - Location: "Kigali, Rwanda"
   - Description: "Luxury accommodation with stunning city views, modern amenities, and excellent service. Perfect for business and leisure travelers."

4. Fill in Property Details:
   - Bedrooms: 3
   - Bathrooms: 2
   - Area: 1200 (sq ft)

5. Set Pricing:
   - Price per Night: $150

6. Add Images (use Unsplash URLs):
   - Main Image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`
   - Click "Add Another Image" and add:
     - `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80`
     - `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80`

7. Select Amenities:
   - WiFi ✓
   - Pool ✓
   - Restaurant ✓
   - Air Conditioning ✓
   - Parking ✓
   - Security ✓

8. Check "Eco-Friendly Property" checkbox
9. Click "Create New Listing"
10. Wait for success message
11. Verify redirect back to Vendor Dashboard

**Expected Result:**
- Form validation works (errors for empty required fields)
- Success message displayed
- Property stored in localStorage under 'vendor_properties'
- Redirected to /vendor after 2 seconds

**Test Data:**
```json
{
  "name": "Sunrise Villa Kigali",
  "type": "Hotel",
  "location": "Kigali, Rwanda",
  "description": "Luxury accommodation with stunning city views...",
  "price": 150,
  "beds": 3,
  "baths": 2,
  "area": 1200,
  "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "additionalImages": [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
  ],
  "amenities": ["WiFi", "Pool", "Restaurant", "Air Conditioning", "Parking", "Security"],
  "ecoFriendly": true
}
```

---

### 1.5 Verify Property on Admin Dashboard
**Objective:** Check if property appears on admin panel

**Steps:**
1. Navigate to: http://localhost:5174/admin
2. Check "Accommodations" section
3. Scroll through properties list
4. Look for "Sunrise Villa Kigali"

**Expected Result:**
- Admin dashboard loads correctly
- Platform stats displayed
- Property may not appear immediately (mock data limitation)
- In production, would show all submitted properties

**Note:** Current implementation uses localStorage. Properties need to be integrated with mock accommodations for display.

---

### 1.6 Logout as Vendor
**Objective:** Successfully log out

**Steps:**
1. From any page, locate user menu in header
2. Click "Logout" or user avatar dropdown
3. Click "Logout" option
4. Verify redirect to home page

**Expected Result:**
- User logged out successfully
- localStorage 'auth_token' and 'user' cleared
- Redirected to /
- Header shows "Login" button again

---

## Test Scenario 2: Regular User Workflow

### 2.1 Create Regular User Account
**Objective:** Register as a regular user/guest

**Steps:**
1. Ensure logged out
2. Click "Signup"
3. Fill in registration form:
   - Full Name: "Jane Traveler"
   - Email: "user@test.com"
   - Phone: "+250 788 987 654"
   - Password: "password123"
   - Confirm Password: "password123"
4. Check terms agreement
5. Click "Sign Up"

**Expected Result:**
- Successfully registered
- Redirected to profile
- Role: "user"

**Test Data:**
```json
{
  "fullName": "Jane Traveler",
  "email": "user@test.com",
  "phone": "+250 788 987 654",
  "password": "password123",
  "role": "user"
}
```

---

### 2.2 Browse Properties
**Objective:** Explore available accommodations

**Steps:**
1. From home page, click "Accommodations" in nav
2. Or navigate to: http://localhost:5174/accommodations
3. Browse property cards
4. Test filters:
   - Select property type
   - Adjust price range
   - Filter by rating
5. Click on a property card (e.g., "Kigali Serena Hotel")

**Expected Result:**
- Properties displayed in grid
- Filters work correctly
- Property details page loads
- Images, amenities, pricing displayed

---

### 2.3 Add Property to Wishlist
**Objective:** Save favorite properties

**Steps:**
1. On property detail page
2. Click heart/wishlist icon
3. Navigate to: http://localhost:5174/wishlist
4. Verify property appears in wishlist

**Expected Result:**
- Property added to wishlist
- Toast notification shown
- Wishlist count updates in header
- Property visible in wishlist page

---

### 2.4 Add to Cart
**Objective:** Add property to trip cart

**Steps:**
1. On property detail page
2. Select check-in and check-out dates
3. Select number of guests
4. Click "Add to Cart" or "Book Now"
5. Navigate to: http://localhost:5174/cart

**Expected Result:**
- Property added to cart
- Cart count increases in header
- Property visible in trip cart
- Can update quantity or remove

---

### 2.5 Proceed to Checkout
**Objective:** Complete booking reservation

**Steps:**
1. From Trip Cart, click "Proceed to Checkout"
2. Or navigate to: http://localhost:5174/accommodation/checkout/:id
3. Fill in Guest Information:
   - First Name: "Jane"
   - Last Name: "Traveler"
   - Email: "user@test.com"
   - Phone: "+250 788 987 654"

4. Select Payment Method:
   - Option 1: Credit/Debit Card
     - Card Number: 1234 5678 9012 3456
     - Expiry: 12/25
     - CVV: 123
   - Option 2: Mobile Money

5. Add Special Requests: "Early check-in if possible"
6. Check terms agreement
7. Click "Complete Booking"

**Expected Result:**
- Form validation works
- Card formatting applied
- Payment method switches correctly
- Booking submitted (mock)
- Success confirmation or redirect

**Test Data:**
```json
{
  "guestInfo": {
    "firstName": "Jane",
    "lastName": "Traveler",
    "email": "user@test.com",
    "phone": "+250 788 987 654"
  },
  "paymentMethod": "card",
  "cardInfo": {
    "number": "1234 5678 9012 3456",
    "expiry": "12/25",
    "cvv": "123"
  },
  "specialRequests": "Early check-in if possible"
}
```

---

### 2.6 View My Trips
**Objective:** Access user bookings

**Steps:**
1. Click user menu in header
2. Select "My Trips"
3. Or navigate to: http://localhost:5174/my-trips
4. View booked accommodations
5. Check booking details, dates, status

**Expected Result:**
- My Trips page loads
- Bookings displayed (if any)
- Can view details, cancel, or modify

---

### 2.7 Logout as Regular User
**Objective:** Log out successfully

**Steps:**
1. Click user menu/avatar
2. Click "Logout"
3. Verify redirect to home

**Expected Result:**
- Successfully logged out
- User data cleared
- Redirected to home page

---

## Test Scenario 3: Google OAuth Authentication

### 3.1 Sign Up with Google
**Objective:** Register using Google account

**Steps:**
1. On Signup page, click "Google" button
2. Google Sign-In popup appears
3. Select Google account
4. Grant permissions
5. Verify redirect and account creation

**Expected Result:**
- Google Sign-In popup works
- User profile extracted from Google
- Account created automatically
- Logged in successfully
- Redirected to profile/dashboard

**Note:** Requires VITE_GOOGLE_CLIENT_ID environment variable configured.

---

### 3.2 Sign In with Google
**Objective:** Login using existing Google account

**Steps:**
1. On Login page, click "Google" button
2. Select Google account
3. Verify login successful

**Expected Result:**
- Google authentication works
- User logged in
- Token stored
- Redirected based on role

---

## Test Scenario 4: Multi-Language Support

### 4.1 Switch Languages
**Objective:** Test translation system

**Steps:**
1. Locate language selector in header
2. Click and select different languages:
   - English (EN)
   - Kinyarwanda (RW)
   - French (FR)
   - Chinese (ZH)
   - Swahili (SW)
3. Navigate to different pages
4. Verify all text translates

**Expected Result:**
- Language changes instantly
- All labeled text translates
- Buttons, forms, messages translated
- localStorage saves preference

---

### 4.2 Auto Language Detection
**Objective:** Test browser language detection

**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Check detected language matches browser
4. Change browser language settings
5. Reload and verify detection

**Expected Result:**
- Browser language detected automatically
- Appropriate language set on first visit
- Falls back to English if unsupported

---

## Test Scenario 5: Dark Mode

### 5.1 Toggle Dark Mode
**Objective:** Test theme switching

**Steps:**
1. Locate theme toggle in header
2. Click to switch dark/light mode
3. Navigate to different pages
4. Verify consistent theming

**Expected Result:**
- Mode switches instantly
- All pages support dark mode
- Text contrast correct
- localStorage saves preference
- No white text on white background

---

### 5.2 Auto Theme Detection
**Objective:** Test system preference sync

**Steps:**
1. Clear localStorage dark mode setting
2. Change system preferences (macOS: System Settings > Appearance)
3. Reload application
4. Verify theme matches system

**Expected Result:**
- System theme detected
- Automatically sets dark/light mode
- Updates when system changes

---

## Test Scenario 6: Form Validation

### 6.1 Test Required Fields
**Objective:** Verify validation on all forms

**Forms to Test:**
- Signup form
- Login form
- Forgot Password form
- Property Creation form
- Checkout form

**Steps:**
1. Navigate to each form
2. Try submitting empty
3. Fill one field at a time
4. Verify error messages
5. Submit valid data

**Expected Result:**
- Required field errors show
- Inline validation works
- Error messages translated
- Toast notifications appear
- Successful submission works

---

## Test Scenario 7: Responsive Design

### 7.1 Mobile Testing
**Objective:** Test on mobile viewport

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Samsung, etc.)
4. Navigate through all pages
5. Test all interactions

**Expected Result:**
- Layout responsive
- Navigation menu collapses
- Forms usable
- Images scale
- Dark mode works

---

## Test Scenario 8: Error Handling

### 8.1 Invalid Credentials
**Objective:** Test error messages

**Steps:**
1. Try logging in with wrong password
2. Try non-existent email
3. Try signing up with existing email

**Expected Result:**
- Error messages displayed
- Toast notifications shown
- Form not submitted
- User stays on page

---

## Test Scenario 9: Performance

### 9.1 Page Load Times
**Objective:** Verify performance

**Steps:**
1. Open DevTools > Network tab
2. Navigate to each major page
3. Record load times
4. Check resource sizes

**Expected Result:**
- Pages load under 3 seconds
- Images optimized
- No unnecessary requests
- Smooth transitions

---

## Testing Checklist

### Authentication ✓
- [x] Signup works
- [x] Login works
- [x] Logout works
- [ ] Google OAuth (requires config)
- [x] Forgot Password flow
- [x] Form validation

### Vendor/Host ✓
- [x] Access vendor dashboard
- [x] Create property listing
- [x] Upload images
- [x] Set pricing
- [x] Select amenities
- [ ] View in admin dashboard (needs integration)

### User Booking ✓
- [x] Browse properties
- [x] View details
- [x] Add to wishlist
- [x] Add to cart
- [x] Checkout form
- [x] Guest information
- [x] Payment selection
- [ ] Complete reservation (mock)

### Multi-Language ✓
- [x] Language switcher works
- [x] All pages translate
- [x] Auto browser detection
- [x] localStorage persistence

### Dark Mode ✓
- [x] Toggle works
- [x] All pages support
- [x] System preference sync
- [x] Proper contrast

### Responsive ✓
- [x] Mobile layout
- [x] Tablet layout
- [x] Desktop layout
- [x] Navigation responsive

---

## Known Issues

1. **Property Display:** Created properties stored in localStorage don't automatically appear in main accommodation list (requires mock data integration)

2. **Google OAuth:** Requires environment variable configuration (`VITE_GOOGLE_CLIENT_ID`)

3. **Payment Processing:** Currently mock only - no real payment gateway integration

4. **Image Upload:** Only supports direct URLs, not file uploads from device

5. **Admin Dashboard:** Doesn't dynamically load vendor-created properties from localStorage

---

## Manual Testing Commands

### Clear All Data
```javascript
// Run in browser console
localStorage.clear()
location.reload()
```

### View Stored Properties
```javascript
// Run in browser console
console.log(JSON.parse(localStorage.getItem('vendor_properties') || '[]'))
```

### Check Auth State
```javascript
// Run in browser console
console.log({
  token: localStorage.getItem('auth_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null')
})
```

### Force Language
```javascript
// Run in browser console
localStorage.setItem('merry360_language', 'RW') // or FR, ZH, SW
location.reload()
```

### Force Dark Mode
```javascript
// Run in browser console
localStorage.setItem('darkMode', 'true')
location.reload()
```

---

## Success Criteria

**All tests passed when:**
- ✅ Users can signup and login
- ✅ Vendors can create properties with images
- ✅ Users can browse and book properties
- ✅ Payment checkout form works
- ✅ Multi-language support functional
- ✅ Dark mode works everywhere
- ✅ Responsive on all devices
- ✅ Form validation working
- ✅ Logout clears data correctly

---

**End of Testing Guide**
