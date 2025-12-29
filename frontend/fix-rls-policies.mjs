#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('📝 Fixing RLS policies...\n');

    const queries = [
      // Fix notifications policies
      `DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;`,
      `CREATE POLICY "Users can create own notifications"
        ON public.notifications FOR INSERT
        WITH CHECK (auth.uid() = user_id);`,
      
      // Fix loyalty_transactions policies
      `DROP POLICY IF EXISTS "System can create loyalty transactions" ON public.loyalty_transactions;`,
      `CREATE POLICY "System can create loyalty transactions"
        ON public.loyalty_transactions FOR INSERT
        WITH CHECK (auth.uid() = user_id);`,
      
      // Fix wishlist policies
      `DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;`,
      `DROP POLICY IF EXISTS "Users can insert to wishlist" ON public.wishlist;`,
      `CREATE POLICY "Users can insert to wishlist"
        ON public.wishlist FOR INSERT
        WITH CHECK (auth.uid() = user_id);`,
      `DROP POLICY IF EXISTS "Users can delete from wishlist" ON public.wishlist;`,
      `CREATE POLICY "Users can delete from wishlist"
        ON public.wishlist FOR DELETE
        USING (auth.uid() = user_id);`,
      `DROP POLICY IF EXISTS "Users can update wishlist" ON public.wishlist;`,
      `CREATE POLICY "Users can update wishlist"
        ON public.wishlist FOR UPDATE
        USING (auth.uid() = user_id);`
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('does not exist')) {
        console.log(`⚠️  ${error.message}`);
      }
    }

    console.log('\n✅ RLS policies updated');
    console.log('\nNote: You may need to run these policies directly in the Supabase SQL Editor');
    console.log('Dashboard: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixRLSPolicies();
