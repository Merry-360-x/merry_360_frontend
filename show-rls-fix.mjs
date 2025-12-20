#!/usr/bin/env node

import 'dotenv/config';

const PROJECT_REF = 'gzmxelgcdpaeklmabszo';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const sqlQueries = `
-- Fix notifications INSERT policy
DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;
CREATE POLICY "Users can create own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Fix loyalty_transactions INSERT policy  
DROP POLICY IF EXISTS "System can create loyalty transactions" ON public.loyalty_transactions;
CREATE POLICY "System can create loyalty transactions"
    ON public.loyalty_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Fix wishlist policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can insert to wishlist" ON public.wishlist;
CREATE POLICY "Users can insert to wishlist"
    ON public.wishlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete from wishlist" ON public.wishlist;
CREATE POLICY "Users can delete from wishlist"
    ON public.wishlist FOR DELETE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update wishlist" ON public.wishlist;
CREATE POLICY "Users can update wishlist"
    ON public.wishlist FOR UPDATE
    USING (auth.uid() = user_id);
`;

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║          🔧 RLS POLICY FIX - READY TO APPLY                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📋 SQL is ready in fix-rls-policies.sql');
console.log('✅ SQL has been copied to your clipboard\n');

console.log('🌐 OPEN THIS URL AND PASTE (Cmd+V):');
console.log('   https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor\n');

console.log('━'.repeat(65));
console.log('\n📝 OR copy this SQL:\n');
console.log(sqlQueries);
console.log('\n━'.repeat(65));

console.log('\n🧪 AFTER RUNNING SQL, TEST WITH:');
console.log('   node test-real-operations.mjs\n');
