# Manual Testing Script - Merry 360
**URL:** https://merry360x.com  
**Time Required:** ~30 minutes

---

## Test 1: New User Signup (Email/Password)

### Steps:
1. Open https://merry360x.com in incognito/private window
2. Click "Sign Up" or navigate to `/signup`
3. Fill form:
   - First Name: "Test"
   - Last Name: "User"
   - Email: Use your real email (you'll get confirmation)
   - Phone: "0781234567"
   - Password: "Test@1234"
4. Click "Sign Up"

### Expected Results:
- ✅ No console errors
- ✅ Redirected to `/profile`
- ✅ See profile completion banner (if DOB missing)
- ✅ See "0 Loyalty Points"
- ✅ See "Bronze" tier
- ✅ "Upcoming Trips" section is empty
- ✅ Name displayed in header: "Test User"

### Pass/Fail: ___________

---

## Test 2: New User Signup (Google OAuth)

### Steps:
1. Open https://merry360x.com in NEW incognito window
2. Navigate to `/signup`
3. Click "Sign in with Google" button
4. Select your Google account
5. Grant permissions

### Expected Results:
- ✅ Google popup appears
- ✅ After authorization, redirected to `/profile`
- ✅ Profile shows Google name
- ✅ Empty state for trips
- ✅ 0 loyalty points

### Pass/Fail: ___________

---

## Test 3: Login with Existing Account

### Steps:
1. Logout (click profile → Logout)
2. Navigate to `/login`
3. Enter credentials from Test 1
4. Click "Log In"

### Expected Results:
- ✅ Successfully logged in
- ✅ Redirected to `/profile`
- ✅ See same user data as before

### Pass/Fail: ___________

---

## Test 4: Browse & Search Accommodations

### Steps:
1. While logged in, click "Accommodations" in nav menu
2. OR navigate to `/accommodations`
3. Try search: Type "Kigali" in search box
4. Click search button (magnifying glass)
5. Apply filters:
   - Price range: Drag slider to $200
   - Property Type: Check "Hotel"
   - Minimum Rating: Click "4+⭐"
6. Toggle between List/Map view

### Expected Results:
- ✅ Accommodation list loads
- ✅ Search works (filters by location)
- ✅ Filters apply correctly
- ✅ View toggle works (List ↔ Map)
- ✅ Property cards display images, name, price, rating

### Pass/Fail: ___________

---

## Test 5: View Property Details

### Steps:
1. From accommodation list, click any property card
2. Scroll through property details
3. Check image gallery (click arrows)
4. Read reviews section
5. Scroll to booking form at bottom

### Expected Results:
- ✅ Redirected to `/accommodations/{id}`
- ✅ Property details load correctly
- ✅ Image gallery works
- ✅ Amenities list displayed
- ✅ Reviews visible
- ✅ "Book Now" button present

### Pass/Fail: ___________

---

## Test 6: Complete Booking (CRITICAL TEST)

### Steps:
1. On property detail page, click "Book Now"
2. Fill checkout form:
   - First Name: "Test"
   - Last Name: "Booking"
   - Email: Your email
   - Phone: "0781234567"
3. Payment Method: Keep "Free Booking" selected (default)
4. Add special request: "Early check-in please"
5. Review booking summary on right sidebar
6. Click "Confirm Booking" button
7. Wait for processing

### Expected Results:
- ✅ Redirected to `/accommodations/{id}/checkout`
- ✅ Form loads with user data pre-filled
- ✅ Payment options visible
- ✅ "Free Booking" is selected by default
- ✅ Blue info box: "Pay Later at Property"
- ✅ Booking summary shows correct dates, price
- ✅ After submit, redirected to `/profile?bookingSuccess=true&bookingNumber=MRY...&tab=trips`
- ✅ Success message appears
- ✅ Booking appears in "Upcoming Trips" section
- ✅ Booking number starts with "MRY"

### Pass/Fail: ___________

---

## Test 7: Verify Email Notifications

### Steps:
1. After completing Test 6, check your email inbox
2. Look for 3 emails:
   - One to guest (your email)
   - One to admin (admin@merry360x.com)
   - One to host (property owner email)

### Expected Results:
- ✅ Guest email received within 1-2 minutes
- ✅ Email contains booking confirmation
- ✅ Booking number matches
- ✅ Property details correct
- ✅ Check-in/check-out dates correct

### Pass/Fail: ___________

---

## Test 8: Profile Page Features

### Steps:
1. Navigate to `/profile`
2. Click "Edit Profile"
3. Update phone number
4. Add date of birth
5. Click "Save Changes"
6. Check profile completion banner (should disappear if all fields filled)
7. Click "Enable Two-Factor Authentication"
8. Verify loyalty points display

### Expected Results:
- ✅ Profile data displayed correctly
- ✅ Edit mode works
- ✅ Changes save successfully
- ✅ Completion banner appears/disappears correctly
- ✅ 2FA enable button works (shows modal/instructions)
- ✅ Loyalty section shows: 0 points, Bronze tier

### Pass/Fail: ___________

---

## Test 9: Wishlist/Watchlist

### Steps:
1. Go back to `/accommodations`
2. Hover over a property card
3. Click heart icon (wishlist)
4. Click "Wishlist" in nav menu
5. Verify property appears
6. Click heart again to remove

### Expected Results:
- ✅ Heart icon fills when clicked
- ✅ Counter badge appears in nav (shows "1")
- ✅ Property appears in wishlist page
- ✅ Can remove from wishlist
- ✅ Counter updates

### Pass/Fail: ___________

---

## Test 10: Trip Cart

### Steps:
1. Browse accommodations
2. Click "Add to Cart" on a property (if button exists)
3. Click cart icon in nav
4. View cart items
5. Try "Remove from cart"

### Expected Results:
- ✅ Property added to cart
- ✅ Cart count badge appears
- ✅ Cart page shows items
- ✅ Can remove items

### Pass/Fail: ___________

---

## Test 11: Messages Page

### Steps:
1. Click "Messages" in nav or profile menu
2. Navigate to `/messages`

### Expected Results:
- ✅ Page loads without errors
- ✅ Shows empty state: "no conversations yet"
- ✅ No fake/demo conversations

### Pass/Fail: ___________

---

## Test 12: Admin Account Test

### Steps:
1. Logout
2. Sign up with email: `admin@merry360x.com`
3. Password: Your choice
4. Submit signup

### Expected Results:
- ✅ Redirected to `/admin` (NOT `/profile`)
- ✅ Admin dashboard loads
- ✅ See booking notifications
- ✅ All metrics show 0 or real data
- ✅ No fake/demo bookings

### Pass/Fail: ___________

---

## Test 13: Vendor Dashboard

### Steps:
1. Create new account with role "vendor" (may need to manually update in Supabase)
2. OR update existing user's role to "vendor" in Supabase profiles table
3. Login with vendor account
4. Should be redirected to `/vendor`

### Expected Results:
- ✅ Vendor dashboard loads
- ✅ Stats show 0 for new vendor
- ✅ "No listings yet" message
- ✅ "Create Property" button present
- ✅ No fake/demo listings

### Pass/Fail: ___________

---

## Test 14: Dark Mode Toggle

### Steps:
1. Click theme toggle in nav (sun/moon icon)
2. Switch between light/dark modes
3. Navigate between pages
4. Refresh page

### Expected Results:
- ✅ Theme switches instantly
- ✅ All pages respect theme
- ✅ Theme persists after refresh
- ✅ Text readable in both modes
- ✅ No color contrast issues

### Pass/Fail: ___________

---

## Test 15: Language Switcher

### Steps:
1. Click language dropdown
2. Select different language (EN → RW → FR → ZH)
3. Navigate between pages

### Expected Results:
- ✅ Language changes
- ✅ Text translates (if translations exist)
- ✅ Language persists across pages
- ✅ No broken text

### Pass/Fail: ___________

---

## Test 16: Currency Switcher

### Steps:
1. Click currency dropdown
2. Switch between currencies (RWF → USD → EUR)
3. Check accommodation prices update

### Expected Results:
- ✅ Currency symbol changes
- ✅ Prices convert correctly
- ✅ Currency persists

### Pass/Fail: ___________

---

## Test 17: Mobile Responsiveness

### Steps:
1. Open site on mobile device (or Chrome DevTools mobile view)
2. Test all above flows on mobile
3. Check hamburger menu
4. Test forms on mobile
5. Test booking flow on mobile

### Expected Results:
- ✅ Layout adapts to screen size
- ✅ Mobile menu works
- ✅ Forms are usable
- ✅ Buttons are touch-friendly
- ✅ No horizontal scrolling
- ✅ Images scale properly

### Pass/Fail: ___________

---

## Test 18: Navigation Links

### Steps:
Click every link in:
1. Main navigation menu
2. Footer links
3. Profile dropdown menu

### Expected Results:
- ✅ All links work
- ✅ No 404 errors
- ✅ No broken redirects

### Pass/Fail: ___________

---

## Test 19: Error Handling

### Steps:
1. Try to login with wrong password
2. Try to signup with existing email
3. Try to submit booking form with empty fields
4. Disconnect internet, try to load page

### Expected Results:
- ✅ Error messages displayed
- ✅ Messages are clear and helpful
- ✅ No console errors
- ✅ Graceful offline handling

### Pass/Fail: ___________

---

## Test 20: Browser Compatibility

### Steps:
Repeat key tests on:
1. Chrome
2. Firefox
3. Safari
4. Edge

### Expected Results:
- ✅ Works on all browsers
- ✅ No layout issues
- ✅ No functionality broken

### Pass/Fail: ___________

---

## Summary Report

**Tests Passed:** ____ / 20  
**Tests Failed:** ____ / 20  
**Critical Issues Found:** ___________  
**Minor Issues Found:** ___________  

### Overall Status:
- [ ] ✅ Ready for production
- [ ] ⚠️ Ready with minor fixes needed
- [ ] ❌ Not ready - critical issues found

### Notes:
_________________________________________
_________________________________________
_________________________________________

---

**Tester Name:** ___________  
**Date:** ___________  
**Time Spent:** ___________ minutes
