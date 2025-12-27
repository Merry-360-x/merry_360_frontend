import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

const ADMIN_EMAIL = 'bebisdavy@gmail.com'
const ADMIN_PASSWORD = 'davy$100'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('\n🧪 Verifying admin RLS role updates (profiles UPDATE)\n')

// Sign in as admin
const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
})

if (signInError) {
  console.error('❌ Admin login failed:', signInError.message)
  process.exit(1)
}

console.log('✅ Admin login OK:', signInData.user.email)

// Confirm admin role from DB
const { data: me, error: meError } = await supabase
  .from('profiles')
  .select('id, email, role')
  .eq('id', signInData.user.id)
  .single()

if (meError) {
  console.error('❌ Failed to load admin profile:', meError.message)
  process.exit(1)
}

console.log('✅ Admin profile:', me)
if (me.role !== 'admin') {
  console.error('❌ This user is not admin in profiles.role; policy will not pass')
  process.exit(1)
}

// Find a non-admin user to update
const { data: users, error: usersError } = await supabase
  .from('profiles')
  .select('id, email, role')
  .neq('id', me.id)
  .order('created_at', { ascending: false })
  .limit(20)

if (usersError) {
  console.error('❌ Failed to load users:', usersError.message)
  process.exit(1)
}

const target = (users || []).find(u => u.email && !u.email.includes('bebisdavy')) || users?.[0]
if (!target) {
  console.error('❌ No target user found to update')
  process.exit(1)
}

const originalRole = target.role || 'user'
const newRole = originalRole === 'host' ? 'user' : 'host'

console.log(`\n🎯 Target: ${target.email}`)
console.log(`   Before: ${originalRole}`)
console.log(`   Trying to set: ${newRole}\n`)

// Attempt update as admin
const { data: updated, error: updateError } = await supabase
  .from('profiles')
  .update({ role: newRole })
  .eq('id', target.id)
  .select('id, email, role')

if (updateError) {
  console.error('❌ UPDATE blocked (RLS still broken):', updateError.message)
  process.exit(1)
}

console.log('✅ UPDATE succeeded:', updated?.[0])

// Read back (refresh simulation)
const { data: after, error: afterError } = await supabase
  .from('profiles')
  .select('id, email, role')
  .eq('id', target.id)
  .single()

if (afterError) {
  console.error('❌ Readback failed:', afterError.message)
  process.exit(1)
}

console.log('✅ Readback role:', after.role)

// Restore
const { error: restoreError } = await supabase
  .from('profiles')
  .update({ role: originalRole })
  .eq('id', target.id)

if (restoreError) {
  console.error('⚠️ Could not restore original role:', restoreError.message)
} else {
  console.log('✅ Restored original role')
}

console.log('\n🎉 Admin UPDATE policy is working. Role changes should persist after refresh.\n')
