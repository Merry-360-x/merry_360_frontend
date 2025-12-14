# Supabase Setup Guide

This guide helps you connect the Merry360 frontend to Supabase.

## Prerequisites

- Supabase account (https://supabase.com)
- Supabase CLI installed (`brew install supabase` on macOS)

## Step 1: Link Your Supabase Project

```bash
cd /Users/davy/merry_360_frontend
supabase login
supabase link --project-ref aqrzvlwgkjwaqthsjxpt
```

## Step 2: Set Environment Variables

Update `.env.local` with your Supabase credentials:

```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://aqrzvlwgkjwaqthsjxpt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get your keys from the Supabase dashboard:
1. Go to Project Settings > API
2. Copy the URL and Anon Key

## Step 3: Create Database Tables

The schema is defined in `supabase/migrations/20251213_init_schema.sql`.

To apply the migration:

```bash
# Via Supabase CLI (local)
supabase db push

# Or manually in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Create a new query
# 3. Paste the migration SQL
# 4. Run
```

Tables created:
- `profiles` - User profile data
- `conversations` - Messaging conversations
- `messages` - Real-time messages
- `bookings` - Trip bookings
- `payments` - Payment records

## Step 4: Create Storage Buckets

In the Supabase dashboard, go to Storage and create these buckets:
- `avatars` (public)
- `messages` (public)
- `stories` (public)

## Step 5: Configure Authentication

### Email/Password Auth
Already enabled by default in Supabase.

### Google OAuth
1. Go to Authentication > Providers > Google
2. Add your OAuth credentials
3. Set authorized redirect URIs to: `https://aqrzvlwgkjwaqthsjxpt.supabase.co/auth/v1/callback`

## Step 6: Set Up RLS Policies

The migration includes Row Level Security (RLS) policies. Verify they're enabled:

```sql
-- Check RLS status
select tablename from pg_tables where schemaname = 'public';
-- Should all show RLS enabled

-- Verify policies exist
select * from pg_policies where schemaname = 'public';
```

## Step 7: Run the App

```bash
npm run dev
```

Your app is now connected to Supabase!

## Testing

1. Sign up with email/password or Google
2. Create a booking
3. Send a message to another user (real-time via Supabase Realtime)
4. Upload an avatar (stored in Supabase Storage)

## Troubleshooting

**"Cannot connect to Supabase"**
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Verify project is active in Supabase dashboard

**"RLS policy violation"**
- Ensure you're authenticated
- Check RLS policies in the migration file match your use case

**"Table does not exist"**
- Run the migration: `supabase db push`
- Or manually execute SQL from the migration file

## Next Steps

- Set up automated backups in Supabase dashboard
- Configure email templates for auth (Settings > Email)
- Set up webhooks for payment processing
- Add monitoring and logging
- Configure custom domains and SSL

## Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)
