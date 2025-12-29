#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('🔧 Setting up admin account...\n')

const adminEmail = 'bebisdavy@gmail.com'

async function setupAdmin() {
  try {
    // Update user to admin role
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', adminEmail)
      .select()
    
    if (error) throw error
    
    if (data && data.length > 0) {
      console.log(`✅ Successfully set ${adminEmail} as admin!`)
      console.log(`   User ID: ${data[0].id}`)
      console.log(`   Role: ${data[0].role}`)
    } else {
      console.log(`❌ No user found with email: ${adminEmail}`)
      console.log(`   Please sign up first at the website, then run this script again.`)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

setupAdmin()
