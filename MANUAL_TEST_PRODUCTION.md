# Manual Production Testing Guide

## Test Credentials
- **Email:** kamanzisteve@gmail.com
- **Password:** davy$100
- **Production URL:** https://www.merry360x.com

## Test 1: Become a Host Application

### Step-by-Step:

1. **Navigate to:** https://www.merry360x.com/become-host

2. **Step 1 - Personal Information:**
   - First Name: Steve
   - Last Name: Kamanzi
   - Email: kamanzisteve@gmail.com
   - Phone: +250788123456
   - Address: Kigali, Rwanda
   - Nationality: (Select any)
   - Applicant Type: Individual
   - Hosting Type: **Accommodation** ⚠️ Important!
   - Click **Next**

3. **Step 2 - Verification:**
   - ID Number: 1198012345678901
   - Upload ID Document: (Skip or upload any image)
   - Click **Next**

4. **Step 3 - Listing Basics:**
   - Location: Kigali, Nyarugenge
   - Price per Night: $100
   - Select at least 3 amenities (WiFi, Pool, Parking, etc.)
   - Fill Property Details:
     * Bedrooms: 2
     * Bathrooms: 2
     * Max Guests: 4
   - Click **Next**

5. **Step 4 - Listing Details:**
   - Description: "Beautiful property in the heart of Kigali with amazing amenities and modern facilities. Perfect for travelers and tourists."
   - **Photos:** ⚠️ **REQUIRED** - Upload at least 1 image using PhotoUploader
   - Click **Next**

6. **Step 5 - Review & Submit:**
   - Check "I agree to terms and conditions"
   - Click **Submit**
   
7. **Expected Result:**
   - ✅ Success message appears
   - ✅ Application is saved to database
   - ✅ Photos are uploaded to Cloudinary folder: `merry360x/host-applications/`
   
8. **Check Browser Console:**
   - Open DevTools (F12) → Console tab
   - Look for emoji-marked logs: 🔍 📝 📷 ✅ ❌
   - If error, note the full error message

## Test 2: Add Property (Staff Portal)

### Step-by-Step:

1. **Navigate to:** https://www.merry360x.com/staff/properties/new
   - ⚠️ Requires staff role - may show 404/403 if user doesn't have access

2. **Fill Property Form:**
   - Property Name: Test Property Kigali
   - Property Type: (Select Hotel, Apartment, etc.)
   - Location: Kigali, Gasabo
   - Description: "Amazing property for testing purposes with great amenities."
   - Bedrooms: 2
   - Bathrooms: 2
   - Max Guests: 4
   - Price per Night: $150
   - Select at least 3 amenities
   - **Images:** ⚠️ **REQUIRED** - Upload at least 1 image using PhotoUploader
   
3. **Submit:**
   - Click **Submit** or **Create Property**
   
4. **Expected Result:**
   - ✅ Success message appears
   - ✅ Property is created in database
   - ✅ Images uploaded to Cloudinary folder: `merry360x/properties/`
   - ✅ Redirected to properties list
   
5. **Check Browser Console:**
   - Look for: 🔍 📝 📷 ✅ ❌ logs
   - Note any errors

## Test 3: Add Transportation (Vendor Portal)

### Step-by-Step:

1. **Navigate to:** https://www.merry360x.com/vendor/create-transport
   - ⚠️ Requires vendor role - may show 404/403 if user doesn't have access

2. **Fill Transport Form:**
   - Service Name: Kigali Airport Transfer
   - Vehicle Type: (Select SUV, Sedan, etc.)
   - Route: Kigali Airport → City Center
   - Description: "Comfortable airport transfer service with professional drivers."
   - Capacity: 4
   - Price: $50
   - Select features (A/C, WiFi, GPS)
   - **Images:** ⚠️ **REQUIRED** - Upload at least 1 image using PhotoUploader
   
3. **Submit:**
   - Click **Submit** or **Create Service**
   
4. **Expected Result:**
   - ✅ Success message appears
   - ✅ Transport service created in database
   - ✅ Images uploaded to Cloudinary folder: `merry360x/transport/`
   - ✅ Redirected to services list
   
5. **Check Browser Console:**
   - Look for: 🔍 📝 📷 ✅ ❌ logs
   - Note any errors

## PhotoUploader Component Usage

### How It Works:
1. Click the upload area or drag & drop images
2. Images are automatically:
   - Optimized to 1600x1600px
   - Compressed to 82% quality
   - Limited to 2MB
3. You can reorder images by dragging
4. Remove images by clicking the X button
5. First image becomes the main/cover image

### Required:
- **Host Application:** At least 1 photo
- **Property Creation:** At least 1 image
- **Transport Creation:** At least 1 image

### Supported Formats:
- JPEG/JPG
- PNG
- WebP
- GIF

## Common Issues & Debugging

### Issue: Form Not Submitting

**Check:**
1. Open Browser Console (F12 → Console)
2. Look for validation errors:
   - ❌ Required fields validation failed
   - ❌ Upload at least one image
   - ❌ Select at least one amenity
3. Look for API errors:
   - Supabase error messages
   - Cloudinary upload failures
4. Check network tab:
   - Failed POST requests
   - 401/403 errors (authentication/permission)

### Issue: Images Not Uploading

**Check:**
1. Console shows 📷 logs
2. Cloudinary credentials in .env:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=dxdblhmbm
   VITE_CLOUDINARY_UPLOAD_PRESET=default
   ```
3. Image size < 10MB
4. Supported format (JPEG, PNG, WebP, GIF)

### Issue: Database Error

**Check:**
1. Console shows database error details
2. Check Supabase connection
3. Verify RLS policies allow insert
4. Check user is authenticated
5. Verify column names match:
   - Properties table uses `name` not `title`
   - Properties table uses `bedrooms` not `beds`
   - Properties table uses `bathrooms` not `baths`

## Console Log Reference

### Success Path:
```
🔍 [Form type] submission started
📝 Form data: { ... }
📷 Image URLs extracted: 3 [url1, url2, url3]
📤 Submitting [type] data: { ... }
💾 Saving to database...
✅ [Form type] created successfully!
```

### Error Path:
```
🔍 [Form type] submission started
❌ Required fields validation failed
OR
❌ Upload at least one image
OR
❌ Error [action]: [error message]
Error details: { message, status, data }
```

## Database Verification

### After successful submission, verify in Supabase:

1. **Host Applications:**
   - Table: `host_applications`
   - Check: user_id, status, hosting_type, photos array

2. **Properties:**
   - Table: `properties`
   - Check: name, images array, image (main), amenities

3. **Transport:**
   - Table: `transport_services`
   - Check: name, images array, features

## Cloudinary Verification

### Check uploaded images:

1. Go to: https://console.cloudinary.com/console/media_library
2. Check folders:
   - `merry360x/host-applications/` - Host application photos
   - `merry360x/properties/` - Property images
   - `merry360x/transport/` - Transport images
   - `merry360x/uploads/` - Fallback (shouldn't be used)

## Testing Checklist

- [ ] Log in successfully
- [ ] Navigate to Become a Host
- [ ] Fill all Step 1 fields
- [ ] Select "Accommodation" as hosting type
- [ ] Progress through all 5 steps
- [ ] Upload at least 1 photo in Step 4
- [ ] Submit host application successfully
- [ ] No errors in console
- [ ] Navigate to Staff Add Property (if have access)
- [ ] Fill all property fields
- [ ] Upload at least 1 image
- [ ] Submit property successfully
- [ ] Navigate to Create Transport (if have access)
- [ ] Fill all transport fields
- [ ] Upload at least 1 image
- [ ] Submit transport successfully
- [ ] All images appear in correct Cloudinary folders
- [ ] All data saved to correct database tables

## Notes

- All three forms now use the unified **PhotoUploader** component
- Images are required - forms will NOT submit without at least 1 image
- Console logging added for debugging - check DevTools for detailed errors
- Staff and Vendor portals require specific roles - check user permissions
- Cloudinary folder is automatically set per form type
