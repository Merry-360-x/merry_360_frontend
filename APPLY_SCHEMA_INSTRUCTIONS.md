# 📊 Apply Complete Database Schema

The complete database schema is ready in:
`supabase/migrations/20251220200000_create_complete_schema.sql`

## Quick Apply (Recommended)

1. Go to Supabase SQL Editor:
   https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new

2. Copy the entire content from the file above

3. Paste and click "Run"

## What Gets Created

### Tables
- ✅ tours (with 8 sample tours - safaris, hikes, beach, cultural)
- ✅ vehicles (with 6 sample vehicles - SUVs, vans, buses)
- ✅ bookings (for properties, tours, vehicles)
- ✅ reviews (with automatic rating updates)
- ✅ messages (user-to-user messaging)
- ✅ favorites (wishlist functionality)

### Features
- ✅ Row Level Security (RLS) policies
- ✅ Automatic rating calculations
- ✅ Timestamp auto-updates
- ✅ Proper foreign keys and indexes
- ✅ Sample data for testing

### Admin Powers
Admins can:
- Manage all tours and vehicles
- View all bookings
- Full CRUD on all tables

## After Applying

All pages will automatically load real data:
- ✅ Home page (featured properties & tours)
- ✅ Tours listings
- ✅ Admin Tours page
- ✅ Admin Transport page
- ✅ Admin Users page
- ✅ Admin Accommodations page

Run `npm run build` and `vercel --prod` to deploy!
