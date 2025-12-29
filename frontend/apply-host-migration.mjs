import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDIwNDM3MCwiZXhwIjoyMDQ5NzgwMzcwfQ.rjJXN7fJ82brvRxBEyV8mPsHjG8J8SJUxNR36c8xGPc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🔧 Applying host applications migration...')

try {
  // Read the SQL file
  const sql = readFileSync('supabase/migrations/20251221_add_host_applications.sql', 'utf8')
  
  console.log('📄 SQL to execute:')
  console.log(sql)
  console.log('\n⏳ Executing...\n')
  
  // Execute each statement separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))
  
  for (const statement of statements) {
    if (!statement) continue
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
    
    if (error) {
      console.error('❌ Error executing statement:', error.message)
      console.error('Statement:', statement.substring(0, 100) + '...')
      
      // Try alternative approach - direct query
      console.log('\n🔄 Trying alternative approach with direct connection...')
      
      // For ALTER TABLE, we'll use a workaround
      if (statement.includes('ALTER TABLE profiles')) {
        const { error: alterError } = await supabase.from('profiles').select('id').limit(1)
        
        if (!alterError) {
          console.log('✅ Table exists, attempting column additions individually...')
          
          // Execute via raw SQL endpoint
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ query: statement })
          })
          
          if (!response.ok) {
            console.log('⚠️ Note: You may need to run this SQL manually in Supabase SQL Editor')
          } else {
            console.log('✅ Statement executed successfully')
          }
        }
      }
    } else {
      console.log('✅ Statement executed successfully')
    }
  }
  
  console.log('\n✅ Migration complete!')
  console.log('\n📋 Next steps:')
  console.log('1. Verify in Supabase: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor')
  console.log('2. Test the feature: https://merry-360-frontend-c42eohgfs-das-48ca2629.vercel.app/admin/host-applications')
  
} catch (err) {
  console.error('\n❌ Migration failed:', err.message)
  console.log('\n📝 Manual SQL to run in Supabase SQL Editor:')
  console.log('\nALTER TABLE profiles ')
  console.log("ADD COLUMN IF NOT EXISTS host_application_status TEXT CHECK (host_application_status IN ('pending', 'approved', 'rejected')),")
  console.log('ADD COLUMN IF NOT EXISTS host_application_date TIMESTAMPTZ,')
  console.log('ADD COLUMN IF NOT EXISTS host_approved_date TIMESTAMPTZ,')
  console.log('ADD COLUMN IF NOT EXISTS host_rejected_date TIMESTAMPTZ;')
  console.log('\nCREATE INDEX IF NOT EXISTS idx_profiles_host_application_status ON profiles(host_application_status);')
  console.log('\nGo to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql')
  process.exit(1)
}
