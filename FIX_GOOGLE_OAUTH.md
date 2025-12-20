# Google OAuth DNS Error Fix ✅

## Problem
Google OAuth was redirecting to wrong Supabase URL:
- ❌ **Wrong:** `aqrzvlwgkjwaqthsjxpt.supabase.co` (DNS_PROBE_POSSIBLE)
- ✅ **Correct:** `gzmxelgcdpaeklmabszo.supabase.co`

## What Was Fixed

### 1. Local Environment (✅ DONE)
Updated `.env.local` with correct Supabase credentials:
```bash
VITE_SUPABASE_URL=https://gzmxelgcdpaeklmabszo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Local Development Server (✅ RUNNING)
```bash
npm run dev
# Server: http://localhost:5173/
# ✅ Test Google OAuth on localhost now!
```

### 3. Vercel Production (⚠️ MANUAL STEP REQUIRED)

You must update environment variables in Vercel Dashboard:

**Option A: Vercel Dashboard (Recommended)**
1. Go to: https://vercel.com/das-48ca2629/merry-360-frontend/settings/environment-variables

2. Update these variables for **Production**:

   **VITE_SUPABASE_URL:**
   ```
   https://gzmxelgcdpaeklmabszo.supabase.co
   ```

   **VITE_SUPABASE_ANON_KEY:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w
   ```

3. Click "Save" for each variable

4. Redeploy:
   ```bash
   vercel --prod
   ```

**Option B: Command Line**
```bash
# This will prompt you to confirm each change
vercel env rm VITE_SUPABASE_URL production
# Answer "yes" when prompted

echo "https://gzmxelgcdpaeklmabszo.supabase.co" | vercel env add VITE_SUPABASE_URL production
# Press Enter to confirm

vercel env rm VITE_SUPABASE_ANON_KEY production  
# Answer "yes" when prompted

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w" | vercel env add VITE_SUPABASE_ANON_KEY production
# Press Enter to confirm

# Then redeploy
vercel --prod
```

## Test the Fix

### Test Locally (Right Now!)
1. Open: http://localhost:5173/login
2. Click "Continue with Google"
3. Should redirect to Google (not DNS error!)

### Test Production (After Vercel Update)
1. Go to: https://merry-360-frontend.vercel.app/login
2. Click "Continue with Google"
3. Should redirect to Google sign-in page ✅

## Why This Happened
- The `.env.local` file had an incorrect Supabase project URL
- This URL was also set in Vercel's production environment variables
- Google OAuth redirects to the Supabase auth endpoint
- The wrong URL caused DNS resolution to fail

## Correct Configuration
**Project:** gzmxelgcdpaeklmabszo (West EU - Ireland)
**Region:** eu-west-1
**Full URL:** https://gzmxelgcdpaeklmabszo.supabase.co

---

✅ Local is FIXED and ready to test
⚠️ Production needs manual Vercel environment variable update
🎯 After Vercel update, all authentication will work!
