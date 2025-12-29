# 🧪 Complete Feature Test Guide

Production URL: https://merry-360-frontend-858y6gksh-das-48ca2629.vercel.app

## ⚠️ FIRST: Fix Cloudinary in Production

Go to Vercel Dashboard: https://vercel.com/das-48ca2629/merry-360-frontend/settings/environment-variables

### Add these environment variables for Production:

1. **VITE_CLOUDINARY_CLOUD_NAME** = `dml5w7t0u`
2. **VITE_CLOUDINARY_UPLOAD_PRESET** = `ml_default`
3. **VITE_CLOUDINARY_API_KEY** = `823772645881951` (optional - frontend upload doesn't need this)
4. **VITE_CLOUDINARY_API_SECRET** = `kdAARbF-ApDJtoHniF4eeODEkRY` (optional - frontend upload doesn't need this)

After adding, click "Redeploy" button on the latest deployment.

---

## 📋 Test All Features Checklist

### 1️⃣ Authentication & Sign Up
- [ ] **Sign Up** - Create new account with email/password
  - Go to /register
  - Fill in: First Name, Last Name, Email, Password
  - Submit and verify account created
  
- [ ] **Login** - Sign in with credentials
  - Go to /login
  - Enter email and password
  - Verify successful login and redirect to dashboard

- [ ] **Google OAuth** (if configured)
  - Click "Continue with Google"
  - Authorize and verify account creation/login

- [ ] **Logout & Login Again**
  - Log out from dashboard
  - Log back in
  - Verify all data persists

---

### 2️⃣ User Profile Management

#### Test Personal Information
- [ ] Go to Profile → Personal Info tab
- [ ] Click "Edit"
- [ ] Update all fields:
  - First Name
  - Last Name
  - Phone Number
  - Date of Birth
  - Bio
  - **Studies/Education** (NEW!)
- [ ] Click "Save Changes"
- [ ] Logout and login again
- [ ] Verify all information persists ✅

#### Test Profile Picture Upload
- [ ] Go to Profile page
- [ ] Click camera icon on avatar
- [ ] Select image (max 5MB)
- [ ] Wait for upload (should show spinner)
- [ ] Verify profile picture appears
- [ ] Refresh page - picture should persist
- [ ] Logout and login - picture should still be there ✅

---

### 3️⃣ Become a Host & List Properties

#### Switch to Host Mode
- [ ] Go to Dashboard
- [ ] Look for "Become a Host" or switch to Host role
- [ ] Navigate to Host Dashboard

#### Add a Property
- [ ] Go to Host → Add Property (or similar)
- [ ] Fill in property details:
  - Property Name
  - Description
  - Location/Address
  - Price per night
  - Amenities
  - Upload property photos
- [ ] Submit/Publish property
- [ ] Verify property appears in your listings

#### Manage Properties
- [ ] View all your properties
- [ ] Edit a property
- [ ] Update property details
- [ ] Save changes
- [ ] Delete a property (if feature exists)

---

### 4️⃣ Browse & Search Properties

#### Search Functionality
- [ ] Go to Home/Explore page
- [ ] Use search filters:
  - Location
  - Dates
  - Number of guests
  - Price range
- [ ] Verify search results update

#### Property Details
- [ ] Click on a property
- [ ] View property details page
- [ ] Check all information displays:
  - Photos gallery
  - Description
  - Amenities list
  - Reviews/ratings
  - Host information
  - Pricing
- [ ] Use photo gallery navigation

---

### 5️⃣ Bookings & Cart

#### Add to Cart
- [ ] From property details, select dates
- [ ] Click "Add to Cart" or "Book Now"
- [ ] Verify item added to TripCart
- [ ] Check cart icon shows count

#### Cart Management
- [ ] Go to Cart (/cart)
- [ ] View all cart items
- [ ] Update dates/guests
- [ ] Remove items
- [ ] Verify total price calculation

#### Make a Booking
- [ ] Proceed to checkout from cart
- [ ] Fill in booking details
- [ ] Complete payment (if integrated)
- [ ] Verify booking confirmation

---

### 6️⃣ Dashboard Features

#### User Dashboard
- [ ] View upcoming trips
- [ ] View past trips
- [ ] Check loyalty points
- [ ] View membership tier
- [ ] Access saved/wishlist items

#### Host Dashboard
- [ ] View all properties
- [ ] See booking requests
- [ ] Check earnings/analytics
- [ ] Manage calendar availability

---

### 7️⃣ Admin Features (if admin account)

#### Admin Dashboard
- [ ] Login as admin account
- [ ] Navigate to /admin
- [ ] View dashboard stats:
  - Total users
  - Total properties
  - Total bookings
  - Revenue
- [ ] Manage users
- [ ] Manage properties
- [ ] View all bookings
- [ ] Access admin tools

---

### 8️⃣ Additional Features

#### Wishlist/Favorites
- [ ] Click heart icon on properties
- [ ] View saved items in profile
- [ ] Remove from wishlist

#### Reviews & Ratings
- [ ] Write a review for a property
- [ ] Rate your stay
- [ ] View reviews on property page

#### Messages/Chat (if exists)
- [ ] Send message to host
- [ ] Receive messages
- [ ] Reply to messages
- [ ] View message history

#### Notifications
- [ ] Check notification preferences in profile
- [ ] Enable/disable email, SMS, push notifications
- [ ] Test receiving notifications

#### Multi-language Support
- [ ] Go to Profile → Preferences
- [ ] Change language (English, Kinyarwanda, Français)
- [ ] Verify UI updates

#### Currency Settings
- [ ] Change currency (RWF, USD, EUR)
- [ ] Verify prices update throughout app

---

## 🐛 Known Issues to Check

1. ✅ **Profile Picture Upload** - Should work after fixing Cloudinary env vars
2. ✅ **Profile Data Persistence** - All fields (including studies) should persist
3. ⚠️ **Google OAuth Redirect** - May need Google Console configuration
4. Check for any console errors

---

## 📊 Expected Results

### All features should:
- ✅ Work without errors
- ✅ Persist data across logout/login
- ✅ Display correctly on mobile and desktop
- ✅ Show loading states during operations
- ✅ Display success/error messages
- ✅ Handle edge cases gracefully

---

## 🚨 If Something Fails

1. **Check browser console** for errors
2. **Check Network tab** for failed requests
3. **Verify environment variables** in Vercel
4. **Check Supabase** database for data
5. **Report issue** with screenshots and error messages

---

## 🎯 Priority Tests

1. **Profile Picture Upload** (just added - needs Cloudinary fix)
2. **Studies Field** (just added - should work)
3. **Profile Persistence** (critical - should work)
4. **Host Property Creation** (main feature)
5. **Booking Flow** (main feature)

---

## Next Steps After Tests

Based on test results, we can:
- Fix any bugs found
- Add missing features
- Improve user experience
- Optimize performance
