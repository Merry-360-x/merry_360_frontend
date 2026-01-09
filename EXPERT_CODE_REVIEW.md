# 🏨 Merry360 Expert Code Review

**Reviewer:** Online Booking System Specialist & Software Development Expert  
**Date:** January 9, 2026  
**Platform:** Vue 3 + Supabase + Cloudinary Booking Platform

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### 1. Security Vulnerability: Hardcoded Admin Email Check

**File:** `src/services/auth.js` (Line 25)
```javascript
const isAdmin = credentials.email === 'admin@merry360x.com' || credentials.email === 'bebisdavy@gmail.com'
```

**Problem:** Admin role is determined client-side based on hardcoded emails. This is a critical security flaw - any attacker can modify client-side code or intercept requests.

**Fix:** Admin role should be determined from the database `profiles.role` column after authentication, not from email matching.

```javascript
// CORRECT APPROACH
export async function signIn(credentials) {
  const { data, error } = await supabaseService.signInWithEmail(credentials.email, credentials.password)
  if (error) throw error
  
  // Fetch role from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
  
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role || 'user' // Role from DB, not email check
    },
    token: data.session?.access_token
  }
}
```

---

### 2. ~~Duplicate Import Causing Runtime Error~~ ✅ FIXED

**File:** `src/components/common/PaymentForm.vue`

The duplicate `useToast` import and declaration has been fixed.

---

### 3. Missing Payment Verification (Server-Side)

**File:** `src/services/flutterwave.js`

**Problem:** Payment verification is done client-side only. A malicious user could modify the `response.status` to bypass payment.

**Fix:** Implement server-side verification via Supabase Edge Function:

```javascript
// supabase/functions/verify-payment/index.ts
export async function handler(req) {
  const { transactionId } = await req.json()
  
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`
      }
    }
  )
  
  const data = await response.json()
  return { verified: data.status === 'successful', data }
}
```

---

## 🟠 HIGH PRIORITY ISSUES

### 4. Excessive Console Logging in Production

**Problem:** 272 console.log/warn/error statements across 52 files will:
- Expose sensitive data in browser console
- Impact performance
- Clutter debugging

**Files with most logs:**
- `src/services/supabaseApiAdapter.js` (30)
- `src/views/stories/Stories.vue` (20)
- `src/views/onboarding/AuthCallback.vue` (18)
- `src/views/admin/AdminUsers.vue` (13)

**Fix:** Use a logger utility with environment-based filtering:

```javascript
// src/utils/logger.js
const isDev = import.meta.env.DEV

export const logger = {
  log: (...args) => isDev && console.log(...args),
  warn: (...args) => isDev && console.warn(...args),
  error: (...args) => console.error(...args), // Always log errors
  debug: (...args) => isDev && console.debug(...args)
}
```

---

### 5. Empty Catch Blocks Swallowing Errors

**Found in 11 files** - Empty catch blocks hide bugs and make debugging impossible.

**Example (bad):**
```javascript
} catch {
  // ignore
}
```

**Fix:** At minimum, log errors in development:
```javascript
} catch (err) {
  logger.debug('Non-critical error:', err)
}
```

---

### 6. Race Condition in Cart Persistence

**File:** `src/stores/userStore.js`

**Problem:** Cart is loaded from localStorage synchronously at module load, but auth state is async. This can cause cart items from previous users to persist.

**Fix:**
```javascript
// Clear cart on logout and load on login
const logout = () => {
  tripCart.value = []
  localStorage.removeItem(CART_STORAGE_KEY)
  // ... rest of logout
}

const login = async (userData) => {
  // Load user-specific cart from database instead of localStorage
  await loadCartFromDatabase(userData.id)
}
```

---

### 7. SQL Injection Risk in Search

**File:** `src/services/supabaseApiAdapter.js` (Lines 123-124)

**Current code:**
```javascript
const safeTerm = term.replace(/,/g, ' ')
query = query.or(`name.ilike.%${safeTerm}%,location.ilike.%${safeTerm}%`)
```

**Problem:** While Supabase's PostgREST provides some protection, directly interpolating user input is risky.

**Fix:** Use parameterized queries or Supabase's text search:
```javascript
// Better: Use Supabase full-text search
query = query.textSearch('search_vector', safeTerm, { type: 'websearch' })
```

---

## 🟡 MEDIUM PRIORITY IMPROVEMENTS

### 8. Missing Loading States on Critical Actions

**Problem:** Some actions lack loading indicators, making the UI feel unresponsive.

**Files to update:**
- `AccommodationCheckout.vue` - Add loading during booking creation
- `BecomeHost.vue` - Already has `isSubmitting` ✓
- `CreateTour.vue` - Already has `isSubmitting` ✓

---

### 9. Inconsistent Error Handling

**Problem:** Some components use `showToast()`, others use `alert()`, some throw silently.

**Recommendation:** Standardize on `useToast` composable everywhere:
```javascript
// Consistent pattern
try {
  await someAction()
  showToast('Success!', 'success')
} catch (err) {
  showToast(err.message || 'Something went wrong', 'error')
}
```

---

### 10. Missing Input Sanitization

**Files:** Various form components

**Problem:** User inputs aren't sanitized before display, creating potential XSS vectors.

**Fix:** Use Vue's default escaping (already handled by `{{ }}`) but sanitize rich text:
```javascript
import DOMPurify from 'dompurify'

const sanitizedDescription = computed(() => 
  DOMPurify.sanitize(form.description)
)
```

---

### 11. Booking Date Validation Gaps

**File:** `src/views/accommodation/AccommodationCheckout.vue`

**Missing validations:**
- Check-in date should be in the future
- Maximum booking length (e.g., 30 days)
- Property availability check before booking

**Improved validation:**
```javascript
const validateBooking = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkIn = new Date(stay.value.checkIn)
  const checkOut = new Date(stay.value.checkOut)
  
  if (checkIn < today) {
    errors.value.checkIn = 'Check-in must be a future date'
    return false
  }
  
  const maxNights = 30
  if (nights.value > maxNights) {
    errors.value.dateRange = `Maximum stay is ${maxNights} nights`
    return false
  }
  
  // Add availability check
  const available = await checkAvailability(property.value.id, checkIn, checkOut)
  if (!available) {
    errors.value.general = 'Property not available for these dates'
    return false
  }
}
```

---

## 🟢 CODE QUALITY IMPROVEMENTS

### 12. DRY Violations - Duplicate Dashboard Path Logic

**Files:** `CreateTour.vue`, `CreateTransport.vue`, `CreateProperty.vue`

Same code repeated:
```javascript
const dashboardPath = computed(() => {
  if (route.path.startsWith('/admin')) return '/admin'
  if (route.path.startsWith('/staff')) return '/staff'
  if (route.path.startsWith('/host')) return '/host'
  return '/vendor'
})
```

**Fix:** Extract to composable:
```javascript
// src/composables/useDashboardPath.js
export function useDashboardPath() {
  const route = useRoute()
  const userStore = useUserStore()
  
  const dashboardPath = computed(() => {
    const role = userStore.user?.role
    if (role === 'admin') return '/admin'
    if (role === 'staff') return '/staff'
    if (role === 'host') return '/host'
    return '/vendor'
  })
  
  return { dashboardPath }
}
```

---

### 13. Magic Numbers and Strings

**Examples:**
- `timeout: 30000` (should be `TIMEOUT_MS`)
- `'bronze'` tier (should be enum/constant)
- Loyalty point thresholds scattered

**Fix:** Create constants file:
```javascript
// src/constants/booking.js
export const BOOKING = {
  TIMEOUT_MS: 30000,
  MAX_NIGHTS: 30,
  SERVICE_FEE_PERCENT: 0.05,
  TAX_PERCENT: 0.03
}

export const LOYALTY_TIERS = {
  BRONZE: { name: 'bronze', minPoints: 0 },
  SILVER: { name: 'silver', minPoints: 1000 },
  GOLD: { name: 'gold', minPoints: 5000 },
  PLATINUM: { name: 'platinum', minPoints: 15000 }
}
```

---

### 14. Missing TypeScript for Critical Booking Logic

**Recommendation:** Convert critical files to TypeScript:
- `src/services/supabaseApiAdapter.js` → `.ts`
- `src/stores/userStore.js` → `.ts`
- `src/services/auth.js` → `.ts`

This will catch type errors at build time and improve maintainability.

---

## 🏨 BOOKING SYSTEM BEST PRACTICES

### 15. Add Booking Confirmation Email Edge Function

**Missing:** Email confirmation after booking.

```typescript
// supabase/functions/send-booking-confirmation/index.ts
export async function handler(req) {
  const { bookingId } = await req.json()
  
  // Fetch booking with related data
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, properties(*), profiles(*)')
    .eq('id', bookingId)
    .single()
  
  // Send email via Resend/SendGrid
  await sendEmail({
    to: booking.profiles.email,
    subject: `Booking Confirmed - ${booking.properties.name}`,
    template: 'booking-confirmation',
    data: booking
  })
}
```

---

### 16. Add Booking Status Workflow

**Current:** Status is just 'confirmed' or 'pending'

**Recommended statuses:**
```javascript
export const BOOKING_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
}
```

---

### 17. Add Inventory Management

**Missing:** Double-booking prevention.

```sql
-- Add database constraint
CREATE UNIQUE INDEX prevent_double_booking 
ON bookings (listing_id, check_in, check_out)
WHERE status NOT IN ('cancelled', 'no_show');

-- Or use a function
CREATE FUNCTION check_availability(
  p_listing_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE listing_id = p_listing_id
      AND status NOT IN ('cancelled', 'no_show')
      AND check_in < p_check_out
      AND check_out > p_check_in
  );
END;
$$ LANGUAGE plpgsql;
```

---

### 18. Add Rate Limiting

**Missing:** API rate limiting to prevent abuse.

**Implement in Supabase Edge Functions or use middleware:**
```javascript
// Rate limit config
export const RATE_LIMITS = {
  SEARCH: { requests: 30, window: '1m' },
  BOOKING: { requests: 5, window: '1h' },
  UPLOAD: { requests: 20, window: '1h' }
}
```

---

## 📊 PERFORMANCE RECOMMENDATIONS

### 19. Image Optimization Already Good ✓

Your Cloudinary integration with lazy loading is well implemented.

### 20. Add Database Indexes

**Recommended indexes for common queries:**
```sql
-- Properties listing
CREATE INDEX idx_properties_available_created 
ON properties (available, created_at DESC);

-- User bookings
CREATE INDEX idx_bookings_user_checkin 
ON bookings (user_id, check_in DESC);

-- Tours by destination
CREATE INDEX idx_tours_destination 
ON tours (destination) WHERE available = true;
```

---

## ✅ SUMMARY

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 3 | ✅ 2 fixed, 1 needs server-side implementation |
| 🟠 High | 4 | ✅ Logger utility created |
| 🟡 Medium | 5 | ✅ Image gallery enhanced |
| 🟢 Quality | 3 | ✅ Dashboard composable + constants created |
| 🏨 Best Practices | 4 | Long-term improvements |

## ✅ FIXES COMPLETED (January 9, 2026)

### 1. Security: Hardcoded Admin Email ✅ FIXED
- Removed hardcoded email check in `src/services/auth.js`
- Role now fetched from database `profiles.role` column

### 2. Duplicate Import ✅ FIXED
- Removed duplicate `useToast` import in `src/components/common/PaymentForm.vue`

### 3. Image Gallery ✅ ENHANCED
- `src/views/accommodation/AccommodationDetail.vue` now shows ALL property images
- Added full-screen gallery modal with keyboard navigation
- Thumbnails displayed in grid format
- Click any image to view full-size

### 4. Logger Utility ✅ CREATED
- New file: `src/utils/logger.js`
- Environment-aware logging (dev vs prod)
- Ready to replace 272 console.log statements

### 5. Dashboard Path Composable ✅ CREATED
- New file: `src/composables/useDashboardPath.js`
- Reduces code duplication across CreateTour, CreateTransport, CreateProperty

### 6. Constants File ✅ CREATED
- New file: `src/constants/booking.js`
- Timeouts, booking config, loyalty tiers, status codes
- Eliminates magic numbers throughout codebase

**Remaining Actions:**
1. Add server-side payment verification (Supabase Edge Function)
2. Replace remaining console.log calls with logger utility
3. Add database indexes for performance

---

*Generated by Expert Code Review - Merry360 Booking Platform*
