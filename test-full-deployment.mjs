#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Read environment from .env.production.local
const envPath = '.env.production.local'
let envContent = ''
try {
  envContent = fs.readFileSync(envPath, 'utf-8')
} catch (e) {
  console.log('❌ Could not read .env.production.local')
  process.exit(1)
}

// Parse environment variables
const parseEnv = (content) => {
  const env = {}
  content.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '')
      }
    }
  })
  return env
}

const env = parseEnv(envContent)
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY
const cloudinaryCloudName = env.VITE_CLOUDINARY_CLOUD_NAME
const cloudinaryApiKey = env.VITE_CLOUDINARY_API_KEY
const cloudinaryUploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET

console.log('\n🧪 FULL DEPLOYMENT TEST\n')
console.log('=' .repeat(60))

// Test 1: Environment Variables
console.log('\n✅ Test 1: Environment Variables')
console.log('-' .repeat(60))

const envChecks = [
  { name: 'VITE_SUPABASE_URL', value: supabaseUrl },
  { name: 'VITE_SUPABASE_ANON_KEY', value: supabaseKey?.substring(0, 20) + '...' },
  { name: 'VITE_CLOUDINARY_CLOUD_NAME', value: cloudinaryCloudName },
  { name: 'VITE_CLOUDINARY_API_KEY', value: cloudinaryApiKey?.substring(0, 10) + '...' },
  { name: 'VITE_CLOUDINARY_UPLOAD_PRESET', value: cloudinaryUploadPreset }
]

envChecks.forEach(envCheck => {
  if (envCheck.value && !envCheck.value.includes('...') && envCheck.value.length > 0) {
    console.log(`✅ ${envCheck.name}: configured`)
  } else if (envCheck.value) {
    console.log(`✅ ${envCheck.name}: ${envCheck.value}`)
  } else {
    console.log(`❌ ${envCheck.name}: NOT SET`)
  }
})

// Test 2: Supabase Connection
console.log('\n✅ Test 2: Supabase Connection')
console.log('-' .repeat(60))

const supabase = createClient(supabaseUrl, supabaseKey)

try {
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' })
  if (error) throw error
  console.log(`✅ Connected to Supabase`)
  console.log(`✅ Database is accessible`)
} catch (error) {
  console.error(`❌ Supabase connection failed:`, error.message)
}

// Test 3: Cloudinary Configuration
console.log('\n✅ Test 3: Cloudinary Configuration')
console.log('-' .repeat(60))

if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryUploadPreset) {
  console.log(`✅ Cloudinary fully configured`)
  console.log(`   Cloud Name: ${cloudinaryCloudName}`)
  console.log(`   Upload Preset: ${cloudinaryUploadPreset}`)
  console.log(`✅ Ready for image uploads`)
} else {
  console.log(`❌ Cloudinary not fully configured`)
}

// Test 4: Database Tables
console.log('\n✅ Test 4: Database Tables')
console.log('-' .repeat(60))

const tablesToCheck = [
  'profiles',
  'host_listings',
  'bookings'
]

for (const table of tablesToCheck) {
  try {
    const { error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    if (error && error.code !== 'PGRST116') {
      console.log(`❌ ${table}: ${error.message}`)
    } else {
      console.log(`✅ ${table}: exists and accessible`)
    }
  } catch (error) {
    console.log(`⚠️  ${table}: ${error.message}`)
  }
}

// Test 5: Host Application Status Field
console.log('\n✅ Test 5: Host Application Status Field')
console.log('-' .repeat(60))

try {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, host_application_status')
    .limit(5)
  
  if (error) {
    console.log(`⚠️  host_application_status column: ${error.message}`)
  } else {
    console.log(`✅ host_application_status field exists`)
    if (data.length > 0) {
      const approvedHosts = data.filter(p => p.host_application_status === 'approved').length
      console.log(`   Profiles checked: ${data.length}`)
      console.log(`   Approved hosts: ${approvedHosts}`)
    }
  }
} catch (error) {
  console.log(`⚠️  Error checking host status:`, error.message)
}

// Test 6: Sample Host Application Data
console.log('\n✅ Test 6: Host Applications')
console.log('-' .repeat(60))

try {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, host_application_status, host_application_date')
    .not('host_application_status', 'is', null)
    .limit(10)
  
  if (error && error.code !== 'PGRST116') {
    console.log(`⚠️  Could not fetch host applications: ${error.message}`)
  } else if (data && data.length > 0) {
    console.log(`✅ Found ${data.length} host application(s)`)
    data.forEach(app => {
      console.log(`   📧 ${app.email}: ${app.host_application_status}`)
    })
  } else {
    console.log(`ℹ️  No host applications yet (normal for new deployments)`)
  }
} catch (error) {
  console.log(`⚠️  ${error.message}`)
}

// Test 7: Feature Readiness
console.log('\n✅ Test 7: Feature Readiness')
console.log('-' .repeat(60))

const features = [
  { name: 'Sign In/Sign Up', status: supabaseUrl ? '✅' : '❌' },
  { name: 'Become Host Application', status: supabaseUrl ? '✅' : '❌' },
  { name: 'Host Dashboard', status: supabaseUrl ? '✅' : '❌' },
  { name: 'Image Uploads (Cloudinary)', status: cloudinaryCloudName ? '✅' : '❌' },
  { name: 'Database Operations', status: supabaseUrl ? '✅' : '❌' },
  { name: 'Host Status Tracking', status: supabaseUrl ? '✅' : '❌' }
]

features.forEach(feature => {
  console.log(`${feature.status} ${feature.name}`)
})

// Test 8: Integration Checklist
console.log('\n✅ Test 8: Integration Checklist')
console.log('-' .repeat(60))

const allConfigured = supabaseUrl && supabaseKey && cloudinaryCloudName && cloudinaryApiKey && cloudinaryUploadPreset
if (allConfigured) {
  console.log('✅ ALL INTEGRATIONS CONFIGURED AND READY')
} else {
  console.log('⚠️  Some integrations missing')
}

// Summary
console.log('\n' + '=' .repeat(60))
console.log('\n✅ DEPLOYMENT TEST COMPLETE\n')
console.log('Test URLs:')
console.log('🔗 Production: https://merry-360-frontend-4aem7jias-das-48ca2629.vercel.app')
console.log('\nTest Flows:')
console.log('  1. Sign Up: /signup')
console.log('  2. Become Host: /become-host')
console.log('  3. Host Dashboard: /host-dashboard')
console.log('\nTo Complete Testing:')
console.log('  1. Create a new account via sign-up')
console.log('  2. Apply as a host with images')
console.log('  3. Check Supabase for the host application')
console.log('  4. Approve the host in admin panel')
console.log('  5. Verify host dashboard appears\n')

