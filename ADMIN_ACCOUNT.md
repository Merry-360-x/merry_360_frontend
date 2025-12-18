# Admin Account Setup

## Admin Access

The admin account is automatically granted based on email address. Any of the following emails will have admin access:

- `admin@merry360x.com`
- `bebisdavy@gmail.com`

## Login Methods

### Method 1: Google OAuth (Recommended)
1. Go to https://merry360x.com/login
2. Click "Sign in with Google"
3. Sign in with one of the admin emails above
4. You will be automatically redirected to `/admin`

### Method 2: Email/Password
1. Go to https://merry360x.com/login
2. Enter admin email: `admin@merry360x.com` or `bebisdavy@gmail.com`
3. Enter any password (mock authentication)
4. You will be automatically redirected to `/admin`

## Admin Features

Once logged in as admin, you have access to:

- **Admin Dashboard** (`/admin`) - Overview of platform metrics
  - Total bookings
  - Revenue
  - Active properties
  - Total users
  
- **Manage Properties** (`/admin/properties`) - Property management
- **User Management** - View and manage all users
- **Bookings** - View all bookings across the platform
- **Analytics** - Platform analytics and insights
- **Payments** - Payment management and history

## Technical Implementation

Admin role is checked in multiple places:

1. **Login.vue** - Checks email during Google OAuth and redirects to admin dashboard
2. **Signup.vue** - Checks email during registration
3. **auth.js** - Service layer checks email and sets role
4. **userStore.js** - Has `isAdmin` computed property for role checks
5. **Router** - Admin routes at `/admin/*`

## Security Notes

- Admin access is currently determined by email address
- For production, this should be moved to a database role system
- Consider adding email verification for admin accounts
- Implement proper authentication middleware for admin routes

## Adding New Admin Emails

To add a new admin email, update the check in these files:

1. `src/views/onboarding/Login.vue` (line ~158)
2. `src/views/onboarding/Signup.vue` (line ~197)
3. `src/services/auth.js` (line ~13)

Example:
```javascript
const isAdmin = profile.email === 'admin@merry360x.com' || 
                profile.email === 'bebisdavy@gmail.com' ||
                profile.email === 'newemail@example.com'
```

## Database Schema (Future)

For production, create a `user_roles` table:

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'vendor'))
);
```
