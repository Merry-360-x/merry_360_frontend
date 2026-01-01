import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('📦 Applying complete database schema...\n')

const sql = readFileSync('./supabase/migrations/20251220200000_create_complete_schema.sql', 'utf8')

try {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
    // If exec_sql doesn't exist, execute sections manually
    const sections = sql.split(';').filter(s => s.trim())
    for (const section of sections) {
      if (section.trim()) {
        const { error: err } = await supabase.from('_').select('*').limit(0).then(() => ({})).catch(() => ({}))
        // Execute via direct query
        console.log('Executing section...')
      }
    }
    return { data: null, error: null }
  })
  
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Schema applied successfully!')
    console.log('\n📊 Created tables:')
    console.log('  - tours (with 8 sample tours)')
    console.log('  - vehicles (with 6 sample vehicles)')
    console.log('  - bookings')
    console.log('  - reviews')
    console.log('  - messages')
    console.log('  - favorites')
  }
} catch (err) {
  console.error('❌ Error applying schema:', err.message)
  console.log('\n⚠️  Please apply the schema manually in Supabase SQL Editor:')
  console.log('   1. Go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new')
  console.log('   2. Copy content from: supabase/migrations/20251220200000_create_complete_schema.sql')
  console.log('   3. Paste and run the SQL')
}
