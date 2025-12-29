import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyFix() {
  console.log('🔧 Applying Google OAuth profile creation fix...\n')

  const sql = readFileSync('./apply-oauth-fix.sql', 'utf-8')
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Error applying fix:', error.message)
      
      // Try direct function creation
      console.log('Trying alternative method...\n')
      
      const { error: funcError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS TRIGGER AS $$
          BEGIN
              INSERT INTO public.profiles (id, email, first_name, last_name, phone, avatar_url)
              VALUES (
                  NEW.id,
                  NEW.email,
                  COALESCE(
                      NEW.raw_user_meta_data->>'firstName',
                      NEW.raw_user_meta_data->>'first_name', 
                      NEW.raw_user_meta_data->>'given_name',
                      split_part(NEW.email, '@', 1)
                  ),
                  COALESCE(
                      NEW.raw_user_meta_data->>'lastName',
                      NEW.raw_user_meta_data->>'last_name',
                      NEW.raw_user_meta_data->>'family_name',
                      ''
                  ),
                  COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''),
                  COALESCE(
                      NEW.raw_user_meta_data->>'avatar_url',
                      NEW.raw_user_meta_data->>'picture',
                      ''
                  )
              )
              ON CONFLICT (id) DO UPDATE SET
                  first_name = EXCLUDED.first_name,
                  last_name = EXCLUDED.last_name,
                  avatar_url = EXCLUDED.avatar_url,
                  updated_at = NOW();
              
              RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      })
      
      if (funcError) {
        console.error('❌ Alternative method failed:', funcError.message)
        process.exit(1)
      }
    }
    
    console.log('✅ Google OAuth fix applied successfully!')
    console.log('\n📋 The trigger now handles:')
    console.log('  • Email signups (firstName, lastName metadata)')
    console.log('  • Google OAuth (given_name, family_name, picture metadata)')
    console.log('  • Profile updates on conflict')
    console.log('  • Avatar URL extraction from Google')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

applyFix()
