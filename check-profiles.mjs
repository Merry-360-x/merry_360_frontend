import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkProfiles() {
  console.log('🔍 Checking profiles table...\n');
  
  // Check if profiles table exists and has data
  const { data, error } = await supabase.from('profiles').select('*');
  
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('Error details:', error);
  } else {
    console.log('✅ Profiles table exists');
    console.log('📊 Total profiles:', data.length);
    if (data.length > 0) {
      console.log('\nSample profiles:');
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
    } else {
      console.log('\n⚠️  No profiles found in database!');
    }
  }

  // Check auth users
  console.log('\n🔍 Checking auth.users...');
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.log('❌ Cannot list users (requires service role key)');
  } else {
    console.log('✅ Auth users:', users?.length || 0);
  }
}

checkProfiles();
