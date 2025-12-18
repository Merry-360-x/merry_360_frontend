# Supabase Setup Guide

## Issue
Users created via Google OAuth were not appearing in Supabase database.

## Solution
The code now saves user profiles to Supabase when they log in with Google OAuth.

## Setup Steps

### 1. Create Supabase Tables

Go to your Supabase project → SQL Editor and run the `supabase-setup.sql` script:

```bash
# The script creates:
- profiles table (stores user information)
- bookings table (stores booking data)
- Indexes for better query performance
- Row Level Security policies
- Triggers for updated_at timestamps
```

### 2. Verify Tables Created

After running the script, check:
1. Go to Supabase Dashboard → Table Editor
2. You should see `profiles` and `bookings` tables

### 3. Test User Creation

1. Go to https://merry360x.com/login
2. Click "Sign in with Google"
3. Sign in with your Google account
4. Go to Supabase Dashboard → Table Editor → profiles
5. You should see your user record with:
   - id (from Google)
   - email
   - first_name, last_name
   - avatar_url (from Google profile picture)
   - role ('user' or 'admin')
   - loyalty_points (0 for new users)
   - loyalty_tier ('bronze' for new users)

## What Was Fixed

### Updated Files:
1. **Login.vue** - Added `setUserProfile()` call after Google OAuth
2. **Signup.vue** - Added `setUserProfile()` call after Google OAuth registration
3. **supabase-setup.sql** - Database schema for profiles and bookings

### Profile Data Saved:
```javascript
{
  id: profile.sub,  // Google user ID
  email: profile.email,
  first_name: profile.given_name,
  last_name: profile.family_name,
  full_name: profile.name,
  avatar_url: profile.picture,  // Google profile photo
  role: 'user' or 'admin',
  loyalty_points: 0,
  loyalty_tier: 'bronze',
  created_at: current timestamp,
  updated_at: current timestamp
}
```

## Admin Accounts

Admin accounts are automatically detected based on email:
- admin@merry360x.com
- bebisdavy@gmail.com

When these emails sign in, their role is set to 'admin'.

## Troubleshooting

### Users still not appearing?

1. **Check Supabase Connection**
   ```javascript
   // In browser console at merry360x.com
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

2. **Check for Errors**
   - Open browser DevTools → Console
   - Sign in with Google
   - Look for "Failed to save profile to Supabase" warning
   - Check the error details

3. **Verify RLS Policies**
   - Go to Supabase → Authentication → Policies
   - Make sure policies allow INSERT on profiles table

4. **Manual Table Creation**
   If the SQL script didn't work, create tables manually:
   
   **profiles table:**
   ```
   id: text (Primary Key)
   email: text (unique)
   first_name: text
   last_name: text
   full_name: text
   phone: text
   avatar_url: text
   role: text (default: 'user')
   loyalty_points: int4 (default: 0)
   loyalty_tier: text (default: 'bronze')
   verified: bool (default: false)
   created_at: timestamptz
   updated_at: timestamptz
   ```

## Testing Bookings

After profiles are working, test bookings:

1. Go to an accommodation page
2. Click "Book Now"
3. Fill in details and complete booking
4. Check Supabase → bookings table
5. Your booking should appear with all details

## Next Steps

- Monitor Supabase logs for any errors
- Add email verification flow
- Implement proper RLS policies based on auth.uid()
- Add profile update functionality in UI
