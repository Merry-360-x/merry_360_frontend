import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzmxelgcdpaeklmabszo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ No service role key found in environment variables');
  console.log('Please set SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sql = `
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;

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

console.log('🔧 Executing RLS policy fix...');
console.log('SQL:', sql);

try {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  console.log('✅ RLS policy updated successfully!');
  console.log('Data:', data);
} catch (err) {
  console.error('❌ Exception:', err.message);
  process.exit(1);
}
