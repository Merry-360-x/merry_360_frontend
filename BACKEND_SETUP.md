# 🚀 Quick Start - Connect Your Supabase Backend

Your app already has a backend! You just need to activate it.

## ✅ What You Already Have

- **Frontend**: Vue.js app (this project)
- **Backend**: Supabase at `https://aqrzvlwgkjwaqthsjxpt.supabase.co`
- **Database Schema**: Ready in `APPLY_THIS_SQL.sql`

## 🎯 3 Steps to Activate Everything

### Step 1: Apply Database Schema (5 minutes)

1. Go to your Supabase dashboard:
   https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt

2. Click **SQL Editor** in the left sidebar

3. Open the file `APPLY_THIS_SQL.sql` from this project

4. Copy ALL the SQL code

5. Paste it into the SQL Editor

6. Click **RUN** button

✅ This creates all your tables: users, bookings, messages, payments, profiles

### Step 2: Create Storage Buckets (2 minutes)

1. In Supabase dashboard, click **Storage** in the left sidebar

2. Click **New bucket** and create these 3 buckets:

   **Bucket 1:**
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: 2MB
   - Allowed MIME types: `image/*`

   **Bucket 2:**
   - Name: `messages`
   - Public: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*,application/pdf`

   **Bucket 3:**
   - Name: `stories`
   - Public: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*,video/*`

### Step 3: Enable Google OAuth (10 minutes)

1. In Supabase dashboard, go to **Authentication** > **Providers**

2. Find **Google** and click to enable it

3. You'll need from Google Cloud Console:
   - Client ID (follow `GOOGLE_OAUTH_SETUP.md`)
   - Client Secret (same place as Client ID)

4. Add this callback URL in Google Cloud Console:
   ```
   https://aqrzvlwgkjwaqthsjxpt.supabase.co/auth/v1/callback
   ```

5. In Supabase, add these redirect URLs:
   ```
   https://www.merry360x.com
   http://localhost:5173
   ```

## ✅ That's It! Your Backend is Active

The `.env` file is already configured with:
```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://aqrzvlwgkjwaqthsjxpt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Test Your Backend

Start your dev server:
```bash
npm run dev
```

Then test:
1. **Signup**: Go to http://localhost:5173/signup
   - Try email signup → Should work!
   - Try Google login → Works after Step 3!

2. **Login**: Go to http://localhost:5173/login
   - Use the account you just created

3. **Profile**: Go to http://localhost:5173/profile
   - Update your profile → Saves to Supabase!

4. **Messages**: Try the messaging feature
   - Real-time chat powered by Supabase!

5. **Bookings**: Make a test booking
   - Saved to your database!

## 🗄️ What Your Backend Provides

✅ **Authentication**
- Email/password signup & login
- Google OAuth
- Password reset
- Session management

✅ **Database Tables**
- `profiles` - User profiles with avatars
- `bookings` - Property/tour bookings
- `payments` - Payment records (Stripe integration)
- `messages` - Real-time chat messages
- `conversations` - Chat conversations

✅ **Storage**
- Upload user avatars
- Upload message attachments
- Upload story images/videos

✅ **Real-time Features**
- Live chat messaging
- Booking status updates
- Presence indicators

✅ **Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure API automatically

## 🌐 Deploy to Production

When you deploy to Vercel/Netlify, add these environment variables:

```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://aqrzvlwgkjwaqthsjxpt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjEyNjUsImV4cCI6MjA1MDAwNzI2NX0.S1j5SU4TZJd00k-HXtDswRkrVaBP9BIBz2Y3vWqm9d0
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 📊 Monitor Your Backend

Supabase Dashboard: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt

- **Table Editor**: View/edit database records
- **SQL Editor**: Run custom queries
- **Database**: See table structure
- **Authentication**: Manage users
- **Storage**: View uploaded files
- **API Docs**: Auto-generated API documentation
- **Logs**: Debug errors and monitor usage

## 💡 Pro Tips

1. **Test with Real Data**: Create test bookings, messages, profiles
2. **Check RLS**: Make sure users can only see their own data
3. **Monitor Usage**: Free tier includes 500MB database, 1GB storage
4. **Backup**: Supabase Pro has daily backups ($25/month)
5. **Scale**: Upgrade when you exceed free tier limits

## 🆘 Troubleshooting

**"Error: Invalid API Key"**
- Check that VITE_USE_SUPABASE=true
- Verify VITE_SUPABASE_ANON_KEY is correct
- Restart dev server after changing .env

**"Error: relation does not exist"**
- You need to run the SQL from Step 1
- Go to SQL Editor and apply APPLY_THIS_SQL.sql

**Google OAuth not working**
- Check GOOGLE_OAUTH_SETUP.md
- Verify callback URL in Google Cloud Console
- Enable Google provider in Supabase Auth settings

**Images not uploading**
- Create storage buckets from Step 2
- Make sure buckets are set to public
- Check file size limits

## ✨ You're All Set!

Your app now has a fully functional backend with:
- User authentication
- Database storage
- Real-time features
- File uploads
- Secure API

All running on Supabase's global infrastructure! 🚀
