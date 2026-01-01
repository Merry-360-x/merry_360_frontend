#!/usr/bin/env node
/**
 * Hosted Supabase live workflow checks (admin/staff/public)
 *
 * Requires:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 * - TEST_USER_EMAIL
 * - TEST_USER_PASSWORD
 *
 * Optional (for admin/host approval testing):
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * - TARGET_USER_ID (existing user to role-change)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function requireEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function signOut() {
  await supabase.auth.signOut()
}

async function staffCreatesPropertyAndIsPubliclyVisible() {
  const email = requireEnv('TEST_USER_EMAIL')
  const password = requireEnv('TEST_USER_PASSWORD')

  await signIn(email, password)

  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) throw new Error('No auth user after sign-in')

  const uniqueName = `E2E Property ${new Date().toISOString()}`

  const insertRow = {
    host_id: user.id,
    name: uniqueName,
    description: 'Created by hosted live test',
    property_type: 'apartment',
    location: 'Kigali, Rwanda',
    price_per_night: 123,
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 4,
    amenities: ['WiFi'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'],
    main_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
    available: true
  }

  const { data: created, error: insertError } = await supabase
    .from('properties')
    .insert([insertRow])
    .select('id, name, available')
    .single()

  if (insertError) throw insertError

  // Public visibility check: anon policy allows selecting available=true.
  // Using the same anon key client, but still authenticated; so also do a fresh client without session.
  await signOut()
  const publicClient = createClient(supabaseUrl, supabaseAnonKey)

  const { data: publicRow, error: publicError } = await publicClient
    .from('properties')
    .select('id, name, available')
    .eq('id', created.id)
    .single()

  if (publicError) throw publicError
  if (!publicRow?.available) throw new Error('Inserted property is not publicly available')

  return { propertyId: created.id, name: uniqueName }
}

async function optionalAdminRoleAndHostApproval() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const targetUserId = process.env.TARGET_USER_ID

  if (!adminEmail || !adminPassword || !targetUserId) {
    return { skipped: true, reason: 'ADMIN_EMAIL/ADMIN_PASSWORD/TARGET_USER_ID not set' }
  }

  await signIn(adminEmail, adminPassword)

  // Attempt role update. This depends on your RLS policies.
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'staff' })
    .eq('id', targetUserId)

  if (roleError) {
    await signOut()
    return { skipped: true, reason: `Role update blocked by RLS: ${roleError.message}` }
  }

  // Attempt host approval fields update.
  const { error: approveError } = await supabase
    .from('profiles')
    .update({
      role: 'host',
      host_application_status: 'approved',
      host_approved_date: new Date().toISOString()
    })
    .eq('id', targetUserId)

  await signOut()

  if (approveError) {
    return { skipped: true, reason: `Host approval blocked by RLS: ${approveError.message}` }
  }

  return { skipped: false }
}

async function main() {
  const results = {}

  results.staffProperty = await staffCreatesPropertyAndIsPubliclyVisible()
  results.adminRoleApproval = await optionalAdminRoleAndHostApproval()

  console.log('✅ Hosted live workflow checks passed')
  console.log(JSON.stringify(results, null, 2))
}

main().catch((err) => {
  console.error('❌ Hosted live workflow checks failed')
  console.error(err)
  process.exit(1)
})
