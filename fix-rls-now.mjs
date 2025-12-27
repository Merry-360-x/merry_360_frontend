import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzmxelgcdpaeklmabszo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8';

// Try using service role key from environment, fallback to anon
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

console.log('🔧 Attempting to fix RLS policies...');
console.log('Using key type:', serviceRoleKey.includes('service_role') ? 'SERVICE ROLE' : 'ANON');

const supabase = createClient(supabaseUrl, serviceRoleKey);

const sql = `
-- Drop existing policy
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;

-- Create new policy for admin updates
CREATE POLICY "Allow admins to update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);
`;

console.log('SQL to execute:');
console.log(sql);
console.log('');

try {
  // Try to execute via RPC if available
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('❌ RPC Error:', error.message);
    console.log('\n💡 This requires the service role key or SQL Editor access.');
    console.log('Please run this SQL in Supabase Dashboard:');
    console.log('https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new');
    process.exit(1);
  }
  
  console.log('✅ RLS policy updated successfully!');
  console.log('Data:', data);
} catch (err) {
  console.error('❌ Exception:', err.message);
  console.log('\n💡 The RLS fix requires direct SQL execution.');
  console.log('Please run this SQL in Supabase Dashboard:');
  console.log('https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new');
  process.exit(1);
}
