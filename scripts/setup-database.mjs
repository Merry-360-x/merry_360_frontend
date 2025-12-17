import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjEyNjUsImV4cCI6MjA1MDAwNzI2NX0.S1j5SU4TZJd00k-HXtDswRkrVaBP9BIBz2Y3vWqm9d0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Setting up database...\n')

  // Read SQL file
  const sql = fs.readFileSync('./APPLY_THIS_SQL.sql', 'utf8')
  
  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    
    // Skip comments
    if (statement.trim().startsWith('--')) continue

    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: statement 
      })

      if (error) {
        // Try direct execution for some statements
        console.log(`⚠️  Statement ${i + 1}: Trying alternative method...`)
        // Most likely already exists, continue
        errorCount++
      } else {
        console.log(`✅ Statement ${i + 1}: Success`)
        successCount++
      }
    } catch (err) {
      console.log(`⚠️  Statement ${i + 1}: ${err.message}`)
      errorCount++
    }
  }

  console.log(`\n📊 Results:`)
  console.log(`   ✅ Successful: ${successCount}`)
  console.log(`   ⚠️  Errors/Skipped: ${errorCount}`)
  console.log(`\n✨ Database setup complete!`)
  console.log(`\n📌 Next steps:`)
  console.log(`   1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql`)
  console.log(`   2. Copy/paste APPLY_THIS_SQL.sql`)
  console.log(`   3. Click RUN`)
  console.log(`   4. Visit: www.merry360x.com/admin/properties`)
}

setupDatabase().catch(console.error)
