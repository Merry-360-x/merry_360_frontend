import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const supabase = createClient(supabaseUrl, serviceRoleKey)

console.log('🚀 Applying database schema to Supabase...\n')

// Read SQL file
const sql = readFileSync('./APPLY_THIS_SQL.sql', 'utf8')

// Split into statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`📝 Found ${statements.length} SQL statements\n`)

let success = 0
let errors = 0

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i] + ';'
  
  try {
    // Execute via pg connection
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'exec',
        params: { sql: statement }
      })
    })
    
    if (response.ok) {
      console.log(`✅ ${i + 1}/${statements.length}`)
      success++
    } else {
      console.log(`⚠️  ${i + 1}/${statements.length}: ${response.status}`)
      errors++
    }
  } catch (err) {
    console.log(`❌ ${i + 1}/${statements.length}: ${err.message}`)
    errors++
  }
}

console.log(`\n📊 Complete: ${success} success, ${errors} errors\n`)

if (errors === statements.length) {
  console.log('❌ API method not working. Use manual method:\n')
  console.log('1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new')
  console.log('2. Copy/paste APPLY_THIS_SQL.sql')
  console.log('3. Click RUN\n')
} else {
  console.log('✅ Check your tables at:')
  console.log('   https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/editor\n')
}
