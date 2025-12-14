-- Manual SQL execution for Supabase Cloud
-- Copy and paste this entire file into Supabase Dashboard > SQL Editor
-- Then click "Run" to create all tables and policies

-- ===============================================
-- MERRY360 DATABASE SCHEMA
-- ===============================================

-- Create profiles table for user metadata
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create conversations table
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  participant_key text unique,
  participants uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table with real-time support
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  attachment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_type text not null,
  booking_item_id integer,
  check_in_date timestamp,
  check_out_date timestamp,
  guests integer,
  total_price numeric(10, 2),
  currency text default 'USD',
  status text default 'pending',
  guest_name text,
  guest_email text,
  guest_phone text,
  special_requests text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create payments table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(10, 2) not null,
  currency text default 'USD',
  status text default 'pending',
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Profiles are publicly readable" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can read conversations they're in" on public.conversations;
drop policy if exists "Users can create conversations" on public.conversations;
drop policy if exists "Users can read messages from their conversations" on public.messages;
drop policy if exists "Users can create their own messages" on public.messages;
drop policy if exists "Users can read their own bookings" on public.bookings;
drop policy if exists "Users can create bookings" on public.bookings;
drop policy if exists "Users can update their own bookings" on public.bookings;
drop policy if exists "Users can read payments for their bookings" on public.payments;
drop policy if exists "Users can create payments for their bookings" on public.payments;

-- Profiles policies
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update 
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert 
  with check (auth.uid() = id);

-- Conversations policies
create policy "Users can read conversations they're in" on public.conversations for select
  using (auth.uid() = any(participants));
create policy "Users can create conversations" on public.conversations for insert
  with check (auth.uid() = any(participants));

-- Messages policies
create policy "Users can read messages from their conversations" on public.messages for select
  using (exists(
    select 1 from public.conversations 
    where id = messages.conversation_id 
    and auth.uid() = any(participants)
  ));
create policy "Users can create their own messages" on public.messages for insert
  with check (auth.uid() = sender_id);

-- Bookings policies
create policy "Users can read their own bookings" on public.bookings for select
  using (auth.uid() = user_id);
create policy "Users can create bookings" on public.bookings for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own bookings" on public.bookings for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Payments policies
create policy "Users can read payments for their bookings" on public.payments for select
  using (exists(
    select 1 from public.bookings 
    where id = payments.booking_id 
    and user_id = auth.uid()
  ));
create policy "Users can create payments for their bookings" on public.payments for insert
  with check (exists(
    select 1 from public.bookings 
    where id = payments.booking_id 
    and user_id = auth.uid()
  ));

-- Create indexes
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists payments_booking_id_idx on public.payments(booking_id);
create index if not exists conversations_participants_idx on public.conversations using gin(participants);

-- ===============================================
-- SCHEMA CREATED SUCCESSFULLY!
-- ===============================================
-- Next: Create storage buckets in Storage section:
-- 1. avatars (public)
-- 2. messages (public)
-- 3. stories (public)
