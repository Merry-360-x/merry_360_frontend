# 🧪 Manual Testing Guide - Full Integration

## Production URL
🔗 **https://merry-360-frontend-4aem7jias-das-48ca2629.vercel.app**

---

## Test 1: Sign Up & Authentication

1. **Go to:** `/signup` 
2. **Fill in:**
   - Email: `testuser+$(date +%s)@example.com`
   - Password: `TestPassword123!`
   - First Name: `Test`
   - Last Name: `User`
3. **Expected:** Account created, redirected to home

✅ **Verification Points:**
- Email confirmation received
- User can log in with new credentials
- Profile data saved to Supabase `profiles` table

---

## Test 2: Sign In

1. **Go to:** `/login`
2. **Enter credentials** from Test 1
3. **Expected:** Logged in, redirected to home

✅ **Verification Points:**
- User menu shows in header
- User name appears in profile dropdown

---

## Test 3: Become Host - Application Form

1. **Go to:** `/become-host`
2. **Fill Step 1 (Personal Info):**
   - First Name: `John`
   - Last Name: `Host`
   - Email: `john@example.com`
   - Phone: `+250788123456`
   - Address: `Kigali, Rwanda`
   - Nationality: `Rwandan`
3. **Click:** Next Step

✅ **Verification Points:**
- Step indicator updates
- Form validates correctly

---

## Test 4: Become Host - Business Info

1. **Fill Step 2 (Business Info):**
   - Business Name: `My Beautiful Villa`
   - Business Type: `Individual/Sole Proprietor`
   - Years in Business: `1-2`
   - Bank Account: `BK123456789`
2. **Click:** Next Step

✅ **Verification Points:**
- All required fields validated
- Navigation works smoothly

---

## Test 5: Become Host - Property Details & Image Upload

1. **Fill Step 3 (Property Details):**
   - Service Type: `Accommodation`
   - Service Name: `Luxury Villa in Kigali`
   - Location: `Kigali, Rwanda`
   - Price: `150000`
   - Description: `Beautiful luxury villa with modern amenities`
2. **Upload Images:**
   - Click "Upload Photos/Documents"
   - Select 1-3 images from your computer
3. **Check:** "I agree to Terms..."
4. **Click:** Submit Application

✅ **Verification Points:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Redirected to home
- ✅ Data saved to Supabase `profiles` table with `host_application_status: 'pending'`

---

## Test 6: Verify Database Storage

### In Supabase Dashboard:
1. **Go to:** Supabase > Your Project > SQL Editor
2. **Run:**
```sql
SELECT id, email, host_application_status, host_application_date 
FROM profiles 
WHERE host_application_status IS NOT NULL 
ORDER BY host_application_date DESC;
```

✅ **Expected:**
- See your test user's host application
- Status: `pending`
- Application data stored in `host_application_data` JSON field

---

## Test 7: Cloudinary Image Verification

1. **Go to:** Cloudinary Dashboard > Media Library
2. **Look for:** Images uploaded from "Become Host" form
3. **Verify:**
   - Images are in `ml_default` upload preset
   - Images are properly tagged

✅ **Expected:**
- Images appear in Cloudinary library
- All uploaded images accessible via URL

---

## Test 8: Admin Approval

1. **Go to:** `/admin/host-applications` (requires admin login)
2. **Find:** Your test application (status: `pending`)
3. **Click:** Approve
4. **Status changes to:** `approved`

✅ **Expected:**
- Application status updated in database
- Host now appears in approved hosts list

---

## Test 9: Host Dashboard Visibility

1. **Log out** (if you're in admin account)
2. **Log in** with your **test host account**
3. **Go to Home** (/)

✅ **Verification Points - Header:**
- ✅ "Become Host" button is **HIDDEN** (since you're approved)
- ✅ "Host Dashboard" button appears in orange instead

✅ **Verification Points - Profile Menu:**
1. **Click:** User profile icon
2. **Look for:** "Host Dashboard" link
3. **Should show:** Orange icon with "Host Dashboard" text
4. **Should NOT show:** "Become Host" link

---

## Test 10: Host Dashboard Functionality

1. **Click:** "Host Dashboard" button or link
2. **Expected:** Dashboard loads with:
   - ✅ Statistics cards (Listings, Bookings, Revenue, Rating)
   - ✅ "Add New Service/Listing" form
   - ✅ My Listings section (empty for new hosts)
   - ✅ Quick Actions sidebar

3. **Add a Test Listing:**
   - Service Type: `Tour`
   - Name: `City Tour of Kigali`
   - Location: `Kigali`
   - Price: `50000`
   - Description: `Guided tour of Kigali city`
   - Click: "Add Service/Listing"

✅ **Verification Points:**
- ✅ Form submits successfully
- ✅ Listing appears in "My Listings"
- ✅ Data saved to Supabase `host_listings` table
- ✅ `host_id` matches current user

---

## Test 11: Image Upload in Host Dashboard

1. **From Host Dashboard:**
2. **In "Add New Service/Listing" form:**
3. **Click:** "Upload Images"
4. **Select:** 1-2 images
5. **Complete:** Form and submit

✅ **Verification Points:**
- ✅ Images upload to Cloudinary
- ✅ No errors in console
- ✅ Images accessible via Cloudinary CDN

---

## Test 12: Database Integration Complete Check

1. **In Supabase Dashboard SQL Editor, run:**

```sql
-- Check profiles
SELECT COUNT(*) as total_users, 
       COUNT(CASE WHEN host_application_status IS NOT NULL THEN 1 END) as hosts 
FROM profiles;

-- Check host listings
SELECT id, host_id, name, type, price 
FROM host_listings 
ORDER BY created_at DESC 
LIMIT 10;

-- Check specific host
SELECT email, host_application_status 
FROM profiles 
WHERE id = 'your-user-id';
```

✅ **Expected Results:**
- Profiles updated with your test data
- Host listings created
- All relationships intact

---

## Cloudinary Configuration Verification

### File Upload Flow:
1. Go to `/become-host` or `/host-dashboard`
2. Upload an image
3. Open **Browser DevTools** (F12) > Network tab
4. Search for "cloudinary"

✅ **Expected:**
- Requests to: `upload.cloudinary.com`
- Upload preset: `ml_default`
- Cloud name: `dml5w7t0u`
- Status: `200 OK` (successful uploads)

---

## Complete Features Checklist

- [ ] Sign up works with email validation
- [ ] Sign in works
- [ ] Become host application form works
- [ ] Images upload to Cloudinary (3 images in become-host form)
- [ ] Host application saved to Supabase with `pending` status
- [ ] Admin can approve/reject applications
- [ ] Host dashboard is visible to approved hosts only
- [ ] "Become Host" button hidden for approved hosts
- [ ] "Host Dashboard" link appears in:
  - [ ] Main header (desktop & mobile)
  - [ ] Profile dropdown menu
- [ ] Host can add listings with images
- [ ] Listings saved to `host_listings` table
- [ ] All Cloudinary uploads successful
- [ ] All database operations working

---

## Troubleshooting

### ❌ Images not uploading:
- Check Cloudinary env variables in Vercel
- Check browser console for CORS errors
- Verify upload preset: `ml_default`

### ❌ Host Dashboard not showing:
- Check `host_application_status` in database
- Ensure status is exactly `'approved'`
- Clear browser cache and reload

### ❌ Sign up/login not working:
- Check Supabase connection
- Verify auth keys in Vercel environment
- Check browser console for errors

---

## Success Criteria ✅

All of the following should work:
1. ✅ Full authentication flow (sign up, sign in, logout)
2. ✅ Host application with image uploads
3. ✅ Database storage of host applications
4. ✅ Admin approval of hosts
5. ✅ Host dashboard visibility to approved hosts only
6. ✅ Host dashboard full functionality with image uploads
7. ✅ All Cloudinary integrations working
8. ✅ All Supabase integrations working
9. ✅ Conditional UI based on host status

If all these pass, **FULL INTEGRATION COMPLETE! 🎉**
