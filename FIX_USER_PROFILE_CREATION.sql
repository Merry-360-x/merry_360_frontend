-- ===============================================
-- FIX: Auto-create user profiles on signup
-- ===============================================
-- This SQL creates a trigger that automatically creates
-- a profile record whenever a new user signs up.
--
-- COPY AND PASTE THIS INTO:
-- Supabase Dashboard > SQL Editor > New Query > Run
-- ===============================================

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, loyalty_points, loyalty_tier, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'firstName', ''),
    coalesce(new.raw_user_meta_data->>'lastName', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    0,
    'bronze',
    now(),
    now()
  );
  return new;
end;
$$;

-- Drop trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to automatically create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===============================================
-- DONE! Now profiles will be automatically created
-- ===============================================

-- Test by signing up a new user. Their profile should
-- automatically appear in the profiles table.
