#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Applying RLS policies directly via SQL...\n');

const policies = [
  {
    name: 'notifications INSERT',
    sql: `
      DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;
      CREATE POLICY "Users can create own notifications"
        ON public.notifications FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `
  },
  {
    name: 'loyalty_transactions INSERT',
    sql: `
      DROP POLICY IF EXISTS "System can create loyalty transactions" ON public.loyalty_transactions;
      CREATE POLICY "System can create loyalty transactions"
        ON public.loyalty_transactions FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `
  },
  {
    name: 'wishlist INSERT',
    sql: `
      DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;
      DROP POLICY IF EXISTS "Users can insert to wishlist" ON public.wishlist;
      CREATE POLICY "Users can insert to wishlist"
        ON public.wishlist FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `
  },
  {
    name: 'wishlist DELETE',
    sql: `
      DROP POLICY IF EXISTS "Users can delete from wishlist" ON public.wishlist;
      CREATE POLICY "Users can delete from wishlist"
        ON public.wishlist FOR DELETE
        USING (auth.uid() = user_id);
    `
  },
  {
    name: 'wishlist UPDATE',
    sql: `
      DROP POLICY IF EXISTS "Users can update wishlist" ON public.wishlist;
      CREATE POLICY "Users can update wishlist"
        ON public.wishlist FOR UPDATE
        USING (auth.uid() = user_id);
    `
  }
];

// Since we can't execute raw SQL via JS client, let's use the SQL Editor URL
console.log('📋 COPY AND RUN THIS IN SUPABASE SQL EDITOR:\n');
console.log('🔗 https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor\n');
console.log('━'.repeat(70));
console.log('\n-- Fix all RLS policies\n');

policies.forEach(policy => {
  console.log(`-- ${policy.name}`);
  console.log(policy.sql);
});

console.log('\n━'.repeat(70));
console.log('\n✨ After running the SQL above, test again with:');
console.log('   node test-real-operations.mjs\n');
