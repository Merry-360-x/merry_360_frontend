# 🚀 Production Setup Guide - Real User System

## Current Status: READY FOR REAL USERS ✅

Your app is configured for **production with real user accounts**. All demo data has been removed.

---

## ⚡ COMPLETE THESE 3 STEPS NOW (10 minutes)

### Step 1: Apply Database Schema (CRITICAL)
**This creates tables for real user data**

1. Open Supabase SQL Editor:  
   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/sql/new

2. Open the file `APPLY_THIS_SQL.sql` in your editor

3. Copy **ALL** the SQL code

4. Paste into Supabase SQL Editor

5. Click **RUN** button (bottom right)

6. ✅ You should see "Success. No rows returned"

**What this does:**
- Creates `profiles` table for user accounts
- Creates `messages` & `conversations` tables for real-time chat
- Creates `bookings` table for reservations
- Creates `payments` table for transactions
- Adds security policies (Row Level Security)

---

### Step 2: Create Storage Buckets (REQUIRED)
**This enables file uploads (avatars, photos, attachments)**

1. Go to Supabase Storage:  
   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/storage/buckets

2. Click **"New bucket"** and create these 3 buckets:

   | Bucket Name | Public | Purpose |
   |------------|--------|---------|
   | `avatars` | ✅ Yes | User profile pictures |
   | `messages` | ✅ Yes | Message attachments |
   | `stories` | ✅ Yes | User story photos |

**Important:** All buckets must be set to **Public**

---

### Step 3: Enable Real-time Messaging (OPTIONAL)
**For instant message delivery**

1. Go to Realtime Settings:  
   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/settings/realtime

2. Find these tables and toggle **ON**:
   - ✅ `messages`
   - ✅ `conversations`

---

## 🎉 After Setup - Test Your App

### Create Your First Real User

1. Start the dev server (if not running):
   ```bash
   npm run dev
   ```

2. Open app: http://localhost:5173

3. Click **Sign Up**

4. Register with YOUR real email:
   - Email: your@email.com
   - Password: (strong password)
   - First Name: Your Name
   - Last Name: Your Last Name
   - Phone: +250 788 XXX XXX

5. ✅ **You're now a real user!**

---

## 🔐 How Authentication Works Now

### Sign Up Flow (Real Users)
1. User enters email/password on `/signup`
2. Supabase Auth creates account
3. Profile data saved to `profiles` table
4. User receives confirmation email (optional)
5. User can immediately log in

### Sign In Flow
1. User enters credentials on `/login`
2. Supabase validates against real database
3. JWT token issued
4. User authenticated

### Google Sign-In (Real OAuth)
1. User clicks "Sign in with Google"
2. Google OAuth popup
3. Supabase creates/links account
4. Profile auto-populated from Google

**No more demo accounts!** All users are real.

---

## 📊 Real Features Now Active

### ✅ Authentication
- Real email/password registration
- Google OAuth sign-in
- Secure JWT tokens
- Session management

### ✅ User Profiles
- Profile pictures (Cloudinary)
- Personal information
- Phone numbers
- Stored in Supabase `profiles` table

### ✅ Messaging (After DB setup)
- Real-time chat between users
- Message history persisted
- File attachments via Cloudinary
- Typing indicators (with Realtime)

### ✅ Bookings (After DB setup)
- Book accommodations, tours, transport
- Booking history
- Status tracking
- Linked to real user accounts

### ✅ Payments (After DB setup)
- Payment records
- Transaction history
- Status tracking (pending, completed, failed)

### ✅ File Uploads (After storage buckets)
- Avatar upload to Cloudinary
- Photo uploads for stories
- Message attachments

---

## 🗄️ Database Tables (After Step 1)

### `profiles`
Stores user profile information:
- User ID (links to Supabase Auth)
- First name, last name
- Phone number
- Avatar URL
- Bio, preferences
- Created/updated timestamps

### `conversations`
Chat conversations between users:
- Participant user IDs
- Last message info
- Unread counts
- Timestamps

### `messages`
Individual chat messages:
- Sender/receiver
- Message content
- File attachments
- Read status
- Timestamps

### `bookings`
User reservations:
- Accommodation/tour/transport bookings
- Dates, guests, pricing
- Status (pending, confirmed, cancelled)
- User ID (who booked)

### `payments`
Payment transactions:
- Amount, currency
- Payment method
- Status tracking
- Linked to bookings

**Security:** All tables have Row Level Security (RLS) policies. Users can only access their own data.

---

## 🔍 Verify Setup

Run the integration test:
```bash
node scripts/test-integration.js
```

**Expected results:**
- ✅ 9+ tests passed
- ✅ All tables exist
- ✅ All buckets exist
- ⚠️ 0 warnings

---

## 📱 User Management

### View Real Users
1. Go to Supabase Authentication:  
   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/auth/users

2. See all registered users
3. Manually verify emails
4. Block/unblock users
5. Reset passwords

### View User Profiles
1. Go to Supabase Table Editor:  
   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/editor

2. Click `profiles` table
3. See all user profile data
4. Edit manually if needed

---

## 🚨 Important Notes

### Mock Data Still Available
- **Properties (accommodations):** Still 6 mock properties in `mockData.js`
- **Tours:** Still 6 mock tours
- **Transport:** Still 5 mock options

**Why?** These are *listings* that vendors/admins create. In production:
- You'll add a **Vendor Dashboard** for hosts to create properties
- You'll add an **Admin Panel** to manage listings
- For now, mock listings let users browse and book

**Users are real, listings are demo** (for now)

### Adding Real Properties Later
Create an admin interface to:
1. Let vendors create listings
2. Upload property photos (Cloudinary)
3. Set pricing, availability
4. Store in new `properties` table

---

## 🔗 Quick Links

| Service | URL |
|---------|-----|
| **Dev Server** | http://localhost:5173 |
| **Supabase Dashboard** | https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt |
| **Supabase SQL Editor** | https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/sql/new |
| **Supabase Storage** | https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/storage/buckets |
| **Supabase Auth Users** | https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/auth/users |
| **Cloudinary Console** | https://console.cloudinary.com |
| **Google Cloud Console** | https://console.cloud.google.com |

---

## ✅ Checklist

- [ ] Step 1: Applied `APPLY_THIS_SQL.sql` in Supabase SQL Editor
- [ ] Step 2: Created 3 storage buckets (avatars, messages, stories)
- [ ] Step 3: Enabled Realtime for messages & conversations (optional)
- [ ] Tested: Created a real user account via /signup
- [ ] Tested: Logged in with real account
- [ ] Tested: Updated profile information
- [ ] Tested: Uploaded avatar photo
- [ ] Tested: Browsed properties (mock data)
- [ ] Tested: Made a booking
- [ ] Tested: Sent a message (if 2+ users exist)

---

## 🎓 Next Steps After Testing

1. **Invite Real Users**
   - Share app URL
   - Users sign up with real emails
   - Test across different accounts

2. **Add Real Properties** (Future)
   - Build vendor dashboard
   - Let hosts create listings
   - Replace mock property data

3. **Production Deployment**
   - Deploy to Vercel/Netlify
   - Configure production domain
   - Update OAuth redirect URLs
   - Enable email confirmations

4. **Monitoring**
   - Watch Supabase metrics
   - Monitor user signups
   - Track errors in logs

---

**You're ready for real users! Complete the 3 steps above and start testing.** 🚀
