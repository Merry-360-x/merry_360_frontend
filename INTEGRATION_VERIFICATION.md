# Integration Verification & Flow Testing Guide

## 🎯 Overview
This document provides comprehensive testing procedures for all critical flows in the Merry360 platform, ensuring Supabase and Cloudinary integrations work flawlessly.

## ✅ Verification Status

### Infrastructure
- ✅ **Supabase Connected**: https://gzmxelgcdpaeklmabszo.supabase.co
- ✅ **Cloudinary Connected**: Cloud `dxdblhmbm` with preset `default`
- ✅ **Production Deployed**: https://merry-360-frontend-3ad10x957-das-48ca2629.vercel.app

### Database Schema
- ✅ **profiles**: User profiles and roles
- ✅ **properties**: Accommodation listings (uses `name`, not `title`)
- ✅ **tours**: Tour packages (uses `name`, not `title`)
- ✅ **vehicles**: Transport services (NOT `transport_services`)
- ✅ **bookings**: User bookings with relationships

---

## 🧪 Testing Procedures

### 1. Login Flow

**Test Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `bebisdavy@gmail.com` OR `admin@merry360x.com` (admin access)
   - Password: Your password
3. Click "Sign In"

**Expected Result:**
- ✅ User is authenticated via Supabase Auth
- ✅ Session token is stored
- ✅ Redirect to appropriate dashboard based on role
- ✅ Profile data loaded from `profiles` table

**Supabase Integration:**
```javascript
// Auth service uses: supabase.auth.signInWithPassword()
// Profile loaded from: supabase.from('profiles').select('*').eq('id', userId)
```

---

### 2. Signup Flow

**Test Steps:**
1. Navigate to `/signup`
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password
   - Phone (optional)
3. Click "Sign Up"

**Expected Result:**
- ✅ User created in Supabase Auth (`auth.users`)
- ✅ Profile auto-created in `profiles` table via trigger
- ✅ User metadata includes name and phone
- ✅ Session established automatically
- ✅ Redirect to user dashboard

**Supabase Integration:**
```javascript
// Creates user: supabase.auth.signUp({ email, password, options: { data: { firstName, lastName, phone } } })
// Trigger creates profile automatically
// Manual backup: supabase.from('profiles').upsert({ user_id, first_name, last_name, phone })
```

---

### 3. Become a Host Flow

**Test Steps:**
1. Login as regular user
2. Navigate to `/become-host` OR `/host/become-host`
3. Fill in host application form:
   - Personal Information
   - Property Information
   - Legal Documents
   - Payment Details
4. Upload documents (uses Cloudinary)
5. Submit application

**Expected Result:**
- ✅ Documents uploaded to Cloudinary (`folder: merry360x/documents`)
- ✅ Profile updated with host application data:
  - `host_application_status`: 'pending'
  - `host_application_date`: timestamp
  - Application fields stored in profile
- ✅ Email notification sent (if configured)
- ✅ Admin can view application in admin panel

**Integrations:**
```javascript
// Cloudinary upload: uploadToCloudinary(file, { folder: 'merry360x/documents' })
// Profile update: supabase.from('profiles').update({ 
//   host_application_status: 'pending',
//   ...applicationData 
// }).eq('id', userId)
```

---

### 4. Listing Properties (Accommodations)

**Test Steps:**
1. Login as host/vendor
2. Navigate to `/vendor/create-property`
3. Fill in property details:
   - Property Name
   - Description
   - Location/City
   - Price per Night
   - Bedrooms/Bathrooms
   - Amenities
4. Upload property images (uses Cloudinary)
5. Submit

**Expected Result:**
- ✅ Images uploaded to Cloudinary (`folder: merry360x/properties`)
- ✅ Property created in `properties` table
- ✅ Field mapping:
  - `name` (NOT title)
  - `property_type`
  - `price_per_night`
  - `images[]` array with Cloudinary URLs
  - `main_image` first uploaded image
  - `host_id` linked to user
  - `available` = true
- ✅ Property visible on `/accommodations` page
- ✅ Cache cleared for immediate display

**Supabase Schema:**
```sql
-- Properties table uses these columns:
- name (TEXT) -- NOT "title"
- property_type (TEXT)
- location (TEXT)
- city (TEXT)
- price_per_night (DECIMAL)
- bedrooms, bathrooms, max_guests (INTEGER)
- amenities (TEXT[])
- images (TEXT[]) -- Cloudinary URLs
- main_image (TEXT)
- host_id (UUID) FK to auth.users
```

---

### 5. Listing Tours

**Test Steps:**
1. Login as vendor
2. Navigate to `/vendor/create-tour`
3. Fill in tour details:
   - Tour Name
   - Destination
   - Duration (days)
   - Price
   - Difficulty
   - Inclusions
4. Upload tour images (uses Cloudinary)
5. Submit

**Expected Result:**
- ✅ Images uploaded to Cloudinary (`folder: merry360x/tours`)
- ✅ Tour created in `tours` table
- ✅ Field mapping:
  - `name` (NOT title)
  - `destination`
  - `duration_days`
  - `price`
  - `images` JSONB array
  - `main_image`
  - `available` = true
- ✅ Tour visible on `/tours` page

**Supabase Schema:**
```sql
-- Tours table uses these columns:
- name (TEXT) -- NOT "title"
- destination (TEXT)
- duration_days (INTEGER)
- price (NUMERIC)
- category (TEXT)
- main_image (TEXT)
- images (JSONB)
- available (BOOLEAN)
```

---

### 6. Listing Transportation

**Test Steps:**
1. Login as vendor
2. Navigate to `/vendor/create-transport`
3. Fill in transport details:
   - Service Name
   - Vehicle Type
   - Route
   - Capacity
   - Price per Day
   - Features
4. Upload vehicle images (uses Cloudinary)
5. Submit

**Expected Result:**
- ✅ Images uploaded to Cloudinary (`folder: merry360x/transport`)
- ✅ Vehicle created in `vehicles` table (NOT `transport_services`)
- ✅ Field mapping:
  - `name`
  - `type` (vehicle type)
  - `capacity`
  - `price_per_day`
  - `driver_included`
  - `available` = true
- ✅ Vehicle visible on `/transport` page

**Supabase Schema:**
```sql
-- Vehicles table (NOT transport_services):
- name (TEXT)
- type (TEXT)
- capacity (INTEGER)
- price_per_day (NUMERIC)
- license_plate (TEXT)
- driver_included (BOOLEAN)
- available (BOOLEAN)
```

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Properties
- ✅ Anyone can view `available = true` properties
- ✅ Hosts can view/edit their own properties
- ✅ Admins can view/edit all properties

### Tours
- ✅ Public can view `available = true` tours
- ✅ Admins can manage all tours

### Vehicles
- ✅ Public can view `available = true` vehicles
- ✅ Admins can manage all vehicles

### Profiles
- ✅ Users can view/edit their own profile
- ✅ Admins have full access

---

## 🚀 Quick Verification Commands

```bash
# Run comprehensive sync verification
node verify-sync.mjs

# Run integration tests
node test-integrations.mjs

# Build and test locally
npm run build

# Deploy to production
vercel --prod
```

---

## 📝 Known Schema Differences

### Code → Database Mapping
- `title` → `name` (properties, tours)
- `transport_services` → `vehicles` (table name)
- `host_applications` → stored in `profiles` table columns

### Fixed Issues
- ✅ aiContext.js now uses `vehicles` table
- ✅ All queries use correct column names
- ✅ PhotoUploader correctly uploads to Cloudinary
- ✅ Auth flow properly creates profiles

---

## 🔍 Debugging

### Check Supabase Logs
```sql
-- Recent properties
SELECT id, name, price_per_night, host_id, created_at 
FROM properties 
ORDER BY created_at DESC 
LIMIT 10;

-- Recent tours
SELECT id, name, destination, price, created_at 
FROM tours 
ORDER BY created_at DESC 
LIMIT 10;

-- Recent vehicles
SELECT id, name, type, price_per_day, created_at 
FROM vehicles 
ORDER BY created_at DESC 
LIMIT 10;

-- Check user profile
SELECT id, first_name, last_name, role, host_application_status 
FROM profiles 
WHERE id = 'user-uuid';
```

### Check Cloudinary Console
- Visit: https://console.cloudinary.com
- Check folders:
  - `merry360x/properties`
  - `merry360x/tours`
  - `merry360x/transport`
  - `merry360x/documents`

---

## ✨ All Systems Operational

- ✅ Supabase integration working
- ✅ Cloudinary integration working
- ✅ Schema aligned with code
- ✅ All flows tested and verified
- ✅ RLS policies configured
- ✅ Production deployed

**Production URL**: https://merry-360-frontend-3ad10x957-das-48ca2629.vercel.app
**Supabase Dashboard**: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo
**Cloudinary Dashboard**: https://console.cloudinary.com
