#!/usr/bin/env node

/**
 * Create Admin Account for Merry 360
 * This script will make an existing user account an admin
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║           MERRY 360 - ADMIN ACCOUNT SETUP                      ║')
console.log('╚════════════════════════════════════════════════════════════════╝')
console.log('')

// Email to make admin (you can change this)
const adminEmail = process.argv[2] || 'bebisdavy@gmail.com'

async function createAdmin() {
  try {
    console.log(`🔍 Searching for user: ${adminEmail}`)
    console.log('')
    
    // Check if user exists
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
    
    if (searchError) throw searchError
    
    if (!existingUsers || existingUsers.length === 0) {
      console.log('❌ No account found with this email!')
      console.log('')
      console.log('📋 To create an admin account:')
      console.log('')
      console.log('1. Go to: https://merry-360-frontend-lmxekrx37-das-48ca2629.vercel.app/register')
      console.log(`2. Sign up with email: ${adminEmail}`)
      console.log('3. Complete the registration')
      console.log('4. Run this script again')
      console.log('')
      console.log('Or use a different email:')
      console.log(`   node create-admin-account.mjs your-email@example.com`)
      console.log('')
      return
    }
    
    console.log('✅ User found!')
    console.log(`   Name: ${existingUsers[0].first_name} ${existingUsers[0].last_name}`)
    console.log(`   Current Role: ${existingUsers[0].role || 'user'}`)
    console.log('')
    
    if (existingUsers[0].role === 'admin') {
      console.log('ℹ️  This account is already an admin!')
      console.log('')
      console.log('✅ You can now access the admin dashboard at:')
      console.log('   https://merry-360-frontend-lmxekrx37-das-48ca2629.vercel.app/admin')
      console.log('')
      return
    }
    
    console.log('🔧 Upgrading account to admin...')
    
    // Update to admin role
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', adminEmail)
      .select()
    
    if (error) throw error
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ SUCCESS! Admin account created!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log(`👤 Admin Details:`)
    console.log(`   Email: ${data[0].email}`)
    console.log(`   Name: ${data[0].first_name} ${data[0].last_name}`)
    console.log(`   Role: ${data[0].role}`)
    console.log(`   User ID: ${data[0].id}`)
    console.log('')
    console.log('🎯 Next Steps:')
    console.log('')
    console.log('1. Login at: https://merry-360-frontend-lmxekrx37-das-48ca2629.vercel.app/login')
    console.log(`2. Use email: ${adminEmail}`)
    console.log('3. Navigate to: /admin')
    console.log('')
    console.log('🔑 Admin Features Available:')
    console.log('   • View all users')
    console.log('   • Manage all properties')
    console.log('   • View all bookings')
    console.log('   • Access analytics dashboard')
    console.log('   • Change user roles')
    console.log('   • Approve/reject properties')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (err) {
    console.error('')
    console.error('❌ Error:', err.message)
    console.error('')
    
    if (err.message.includes('duplicate')) {
      console.log('ℹ️  This might be because the user already has admin role.')
      console.log('   Try logging in and accessing /admin')
    }
  }
}

// Show usage if help is requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage:')
  console.log('  node create-admin-account.mjs [email]')
  console.log('')
  console.log('Examples:')
  console.log('  node create-admin-account.mjs                    # Uses default: bebisdavy@gmail.com')
  console.log('  node create-admin-account.mjs admin@example.com  # Uses custom email')
  console.log('')
  process.exit(0)
}

// Run the script
createAdmin()
