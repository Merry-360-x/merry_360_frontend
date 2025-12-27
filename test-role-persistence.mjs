import { createClient } from '@supabase/supabase-js'

import fs from 'node:fs'
import path from 'node:path'

function loadEnvFile(envPath) {
  try {
    const contents = fs.readFileSync(envPath, 'utf8')
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const equalsIndex = line.indexOf('=')
      if (equalsIndex <= 0) continue
      const key = line.slice(0, equalsIndex).trim()
      let value = line.slice(equalsIndex + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    // ignore
  }
}

// Best-effort load env vars for local script execution (without printing secrets)
const workspaceRoot = process.cwd()
for (const envFilename of ['.env', '.env.local', '.env.production', '.env.vercel.production']) {
  loadEnvFile(path.join(workspaceRoot, envFilename))
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://gzmxelgcdpaeklmabszo.supabase.co'
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  ''

if (!supabaseKey) {
  console.error('❌ Missing Supabase service key for this test.')
  console.error('   Set SUPABASE_SERVICE_ROLE_KEY in your .env (kept local; do not commit).')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('\n🧪 TESTING ROLE CHANGE PERSISTENCE - CRITICAL TEST\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// Get all users
const { data: users, error } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })

if (error) {
  console.error('❌ Failed to load users:', error.message)
  process.exit(1)
}

console.log(`✅ Loaded ${users.length} users from database\n`)

// Find a test user (not the admin)
const testUser = users.find(u => u.role === 'user' && !u.email.includes('bebisdavy'))

if (!testUser) {
  console.log('⚠️  No regular users found. Creating test scenario with existing users...\n')
  const anyNonAdmin = users.find(u => !u.email.includes('bebisdavy'))
  if (anyNonAdmin) {
    console.log(`Using user: ${anyNonAdmin.email}\n`)
    performTest(anyNonAdmin)
  } else {
    console.log('❌ No users available for testing')
  }
} else {
  console.log(`Test user: ${testUser.email}`)
  console.log(`Current role: ${testUser.role}\n`)
  await performTest(testUser)
}

async function performTest(user) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('STEP 1: Read current role from database')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const { data: beforeRead, error: readError1 } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .single()
  
  if (readError1) {
    console.error('❌ Failed to read:', readError1.message)
    return
  }
  
  console.log(`   User ID: ${beforeRead.id}`)
  console.log(`   Email: ${beforeRead.email}`)
  console.log(`   Current Role: ${beforeRead.role}\n`)
  
  const originalRole = beforeRead.role
  const newRole = originalRole === 'host' ? 'user' : 'host'
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`STEP 2: Change role from "${originalRole}" to "${newRole}"`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', user.id)
    .select()
  
  if (updateError) {
    console.error('❌ Update FAILED:', updateError.message)
    return
  }
  
  console.log(`   ✅ Update succeeded`)
  console.log(`   Response:`, updateData[0]?.role || 'No data returned\n')
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('STEP 3: Read back immediately (simulating refresh)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const { data: afterRead1, error: readError2 } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .single()
  
  if (readError2) {
    console.error('❌ Failed to read:', readError2.message)
    return
  }
  
  console.log(`   Role in database: ${afterRead1.role}`)
  
  if (afterRead1.role === newRole) {
    console.log(`   ✅ SUCCESS: Role persisted correctly as "${newRole}"\n`)
  } else {
    console.log(`   ❌ FAILED: Role is "${afterRead1.role}", expected "${newRole}"\n`)
  }
  
  // Wait 2 seconds
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('STEP 4: Wait 2 seconds, then read again')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const { data: afterRead2, error: readError3 } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .single()
  
  if (readError3) {
    console.error('❌ Failed to read:', readError3.message)
    return
  }
  
  console.log(`   Role in database after 2 seconds: ${afterRead2.role}`)
  
  if (afterRead2.role === newRole) {
    console.log(`   ✅ SUCCESS: Role still persisted as "${newRole}"\n`)
  } else {
    console.log(`   ❌ FAILED: Role changed to "${afterRead2.role}", expected "${newRole}"\n`)
  }
  
  // Change back to original
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`STEP 5: Change back to original role "${originalRole}"`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const { data: restoreData, error: restoreError } = await supabase
    .from('profiles')
    .update({ role: originalRole })
    .eq('id', user.id)
    .select()
  
  if (restoreError) {
    console.error('❌ Restore FAILED:', restoreError.message)
  } else {
    console.log(`   ✅ Restored to original role: ${originalRole}\n`)
  }
  
  // Final Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 PERSISTENCE TEST RESULTS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  if (afterRead1.role === newRole && afterRead2.role === newRole) {
    console.log('✅ ROLE CHANGES ARE PERSISTING CORRECTLY')
    console.log('✅ Database is saving and retrieving role changes properly')
    console.log('\nIf the UI shows different results, the issue is in the frontend code,')
    console.log('not the database. The database is working perfectly.\n')
  } else {
    console.log('❌ ROLE CHANGES ARE NOT PERSISTING')
    console.log('❌ There is a database issue that needs to be fixed\n')
  }
}
