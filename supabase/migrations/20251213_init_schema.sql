-- Create profiles table for user metadata
create table if not exists profiles (
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
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  participant_key text unique,
  participants uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table with real-time support
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  attachment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create bookings table
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_type text not null, -- 'accommodation', 'tour', 'transport'
  booking_item_id integer,
  check_in_date timestamp,
  check_out_date timestamp,
  guests integer,
  total_price numeric(10, 2),
  currency text default 'USD',
  status text default 'pending', -- 'pending', 'confirmed', 'cancelled'
  guest_name text,
  guest_email text,
  guest_phone text,
  special_requests text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create payments table
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  amount numeric(10, 2) not null,
  currency text default 'USD',
  status text default 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create storage buckets (via UI or separate endpoint)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('messages', 'messages', true);
-- insert into storage.buckets (id, name, public) values ('stories', 'stories', true);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;

-- RLS Policies

-- Profiles: users can read all, update their own
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update 
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert 
  with check (auth.uid() = id);

-- Conversations: users can read their own, insert (with participants)
create policy "Users can read conversations they're in" on conversations for select
  using (auth.uid() = any(participants));
create policy "Users can create conversations" on conversations for insert
  with check (auth.uid() = any(participants));

-- Messages: users can read from conversations they're in, insert their own
create policy "Users can read messages from their conversations" on messages for select
  using (exists(
    select 1 from conversations 
    where id = messages.conversation_id 
    and auth.uid() = any(participants)
  ));
create policy "Users can create their own messages" on messages for insert
  with check (auth.uid() = sender_id);

-- Bookings: users can read their own, insert their own
create policy "Users can read their own bookings" on bookings for select
  using (auth.uid() = user_id);
create policy "Users can create bookings" on bookings for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own bookings" on bookings for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Payments: users can read their own bookings' payments
create policy "Users can read payments for their bookings" on payments for select
  using (exists(
    select 1 from bookings 
    where id = payments.booking_id 
    and user_id = auth.uid()
  ));
create policy "Users can create payments for their bookings" on payments for insert
  with check (exists(
    select 1 from bookings 
    where id = payments.booking_id 
    and user_id = auth.uid()
  ));

-- Create indexes for performance
create index messages_conversation_id_idx on messages(conversation_id);
create index messages_sender_id_idx on messages(sender_id);
create index bookings_user_id_idx on bookings(user_id);
create index payments_booking_id_idx on payments(booking_id);
create index conversations_participants_idx on conversations using gin(participants);
