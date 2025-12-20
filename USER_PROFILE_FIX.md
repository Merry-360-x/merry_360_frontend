# 🔧 USER PROFILE CREATION FIX

## Problem
When users sign up, their profile data wasn't being saved to the `profiles` table in the database.

## Solution
I've implemented a **two-layer approach** to ensure profiles are always created:

### 1. **Database Trigger (Primary Method)** ✅
Automatically creates a profile when a new user signs up in `auth.users`.

**What I did:**
- Created `FIX_USER_PROFILE_CREATION.sql` with a database trigger
- The trigger runs automatically on every new user signup
- It reads user metadata (firstName, lastName, phone) from the signup data

**You need to:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new)
2. Open `FIX_USER_PROFILE_CREATION.sql` in this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click **RUN**
6. ✅ Done! Now all new signups will automatically create profiles

### 2. **Application Code (Backup Method)** ✅
Updated the signup flow to pass user metadata and manually create profiles as a fallback.

**Files Updated:**

#### `src/services/supabase.js`
```javascript
// NOW ACCEPTS METADATA
export async function signUpWithEmail(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata  // firstName, lastName, phone
    }
  })
  if (error) throw error
  return data
}
```

#### `src/services/auth.js`
```javascript
if (USE_SUPABASE) {
  // ✅ Pass metadata during signup
  const { data: authData, error } = await supabaseService.signUpWithEmail(
    data.email, 
    data.password,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    }
  )
  
  // ✅ Manually create profile as backup
  await supabaseService.setUserProfile(authData.user.id, {
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    loyalty_points: 0,
    loyalty_tier: 'bronze',
    updated_at: new Date().toISOString()
  })
}
```

## How It Works Now

### Before Fix ❌
1. User signs up
2. Account created in `auth.users`
3. Profile **NOT** created in `profiles` table
4. User data lost!

### After Fix ✅
1. User fills signup form (name, email, phone, password)
2. Signup request sent with metadata
3. **Database trigger** automatically creates profile with metadata
4. **Backup code** also attempts to create/update profile
5. Profile guaranteed to exist in `profiles` table! 🎉

## Testing

### Step 1: Apply the SQL Trigger
```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Copy FIX_USER_PROFILE_CREATION.sql
# 4. Paste and Run
```

### Step 2: Deploy Updated Code
```bash
# Push to git
git add .
git commit -m "fix: Ensure user profiles are created on signup"
git push origin main

# Deploy to Vercel
npx vercel --prod --yes
```

### Step 3: Test Signup
1. Go to your production site
2. Click "Sign Up"
3. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "+1234567890"
   - Password: "Test123!"
4. Submit
5. Check Supabase Dashboard > Table Editor > profiles
6. ✅ You should see the new profile!

### Verify in Supabase Dashboard
```sql
-- Run this in SQL Editor to see all profiles
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;

-- Check profile for specific user
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.phone,
  p.loyalty_points,
  p.loyalty_tier,
  p.created_at,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;
```

## What Changed

### Database (Supabase)
- **New Trigger**: `on_auth_user_created` - Creates profile automatically
- **New Function**: `handle_new_user()` - Handles profile creation logic

### Frontend Code
- **supabase.js**: Updated `signUpWithEmail()` to accept metadata
- **auth.js**: Updated `signUp()` to pass firstName, lastName, phone during signup

## Benefits

1. ✅ **Automatic**: No manual profile creation needed
2. ✅ **Reliable**: Two-layer approach (trigger + code)
3. ✅ **Complete Data**: All user info saved (name, phone, email)
4. ✅ **Loyalty System Ready**: New users start with 0 points, bronze tier
5. ✅ **Error Handling**: Graceful fallback if trigger fails

## Files Modified
- ✅ `src/services/supabase.js` - Added metadata parameter
- ✅ `src/services/auth.js` - Pass metadata + manual profile creation

## Files Created
- ✅ `FIX_USER_PROFILE_CREATION.sql` - Database trigger

## Next Steps

1. **Run the SQL trigger** in Supabase Dashboard (CRITICAL!)
2. **Deploy the code changes** to production
3. **Test signup** with a new user
4. **Verify profile** appears in database
5. ✅ **Done!**

---

**Status**: Ready to deploy after running SQL trigger
**Priority**: HIGH - Required for user data persistence
**Impact**: All new signups will have complete profiles
