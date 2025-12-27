import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzmxelgcdpaeklmabszo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking RLS policies on profiles table...\n');

// Query the policies
const { data: policies, error } = await supabase
  .from('pg_policies')
  .select('*')
  .eq('tablename', 'profiles');

if (error) {
  console.log('❌ Cannot query policies directly (expected):', error.message);
  console.log('\n💡 To fix this issue, you need to:');
  console.log('1. Go to https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new');
  console.log('2. Run this SQL:');
  console.log('\n---START SQL---');
  console.log('DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;');
  console.log('');
  console.log('CREATE POLICY "Allow admins to update any profile"');
  console.log('ON profiles FOR UPDATE');
  console.log('USING (');
  console.log('  EXISTS (');
  console.log('    SELECT 1 FROM profiles p');
  console.log('    WHERE p.id = auth.uid()');
  console.log('    AND p.role = \'admin\'');
  console.log('  )');
  console.log(');');
  console.log('---END SQL---\n');
} else {
  console.log('✅ Found policies:', policies);
}
