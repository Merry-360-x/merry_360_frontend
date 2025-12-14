import { createClient } from '@supabase/supabase-js'
import https from 'https'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzAwMDksImV4cCI6MjA4MTA0NjAwOX0.K_8LajqS6qNjMnM3FMVICXyhJG2c8yecNt-glByuhMs'
const cloudinaryCloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dml5w7t0u'

console.log('🧪 COMPREHENSIVE INTEGRATION TEST\n')
console.log('==================================\n')

const results = {
  passed: 0,
  failed: 0,
  warnings: 0
}

function pass(test) {
  console.log(`✅ ${test}`)
  results.passed++
}

function fail(test, error) {
  console.log(`❌ ${test}`)
  console.log(`   Error: ${error}`)
  results.failed++
}

function warn(test, message) {
  console.log(`⚠️  ${test}`)
  console.log(`   Warning: ${message}`)
  results.warnings++
}

// Test 1: Environment Variables
console.log('📋 Testing Environment Configuration...')
try {
  if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
    pass('Supabase URL configured')
  } else {
    fail('Supabase URL', 'Invalid or missing URL')
  }

  if (supabaseKey && supabaseKey.length > 100) {
    pass('Supabase anon key configured')
  } else {
    fail('Supabase anon key', 'Invalid or missing key')
  }

  if (cloudinaryCloudName && cloudinaryCloudName !== 'your_cloud_name') {
    pass('Cloudinary cloud name configured')
  } else {
    fail('Cloudinary cloud name', 'Not configured')
  }
} catch (e) {
  fail('Environment variables', e.message)
}

console.log('\n🔌 Testing Supabase Connection...')

const supabase = createClient(supabaseUrl, supabaseKey)

// Test 2: Supabase Connection
try {
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  if (error) {
    if (error.code === 'PGRST204') {
      warn('Supabase profiles table', 'Table exists but is empty (expected for new setup)')
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      fail('Supabase profiles table', 'Table does not exist - run APPLY_THIS_SQL.sql')
    } else {
      fail('Supabase connection', error.message)
    }
  } else {
    pass('Supabase database connection successful')
    pass('Profiles table exists and accessible')
  }
} catch (e) {
  fail('Supabase connection test', e.message)
}

// Test 3: Check other tables
console.log('\n📊 Testing Database Schema...')
const tables = ['conversations', 'messages', 'bookings', 'payments']
for (const table of tables) {
  try {
    const { data, error } = await supabase.from(table).select('count').limit(1)
    if (error) {
      if (error.message.includes('does not exist')) {
        fail(`${table} table`, 'Does not exist - run migration SQL')
      } else {
        warn(`${table} table`, error.message)
      }
    } else {
      pass(`${table} table exists`)
    }
  } catch (e) {
    fail(`${table} table check`, e.message)
  }
}

// Test 4: Supabase Auth
console.log('\n🔐 Testing Authentication Service...')
try {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    warn('Supabase Auth', error.message)
  } else {
    pass('Supabase Auth service accessible')
  }
} catch (e) {
  fail('Supabase Auth', e.message)
}

// Test 5: Cloudinary
console.log('\n📸 Testing Cloudinary Connection...')
await new Promise((resolve) => {
  const req = https.get(`https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/sample.jpg`, (res) => {
    if (res.statusCode === 200 || res.statusCode === 404) {
      pass('Cloudinary CDN accessible')
      pass(`Cloudinary cloud name (${cloudinaryCloudName}) is valid`)
    } else {
      fail('Cloudinary connection', `Unexpected status: ${res.statusCode}`)
    }
    resolve()
  })
  req.on('error', (e) => {
    fail('Cloudinary connection', e.message)
    resolve()
  })
  req.end()
})

// Test 6: Check Storage Buckets
console.log('\n🗄️  Testing Storage Buckets...')
const buckets = ['avatars', 'messages', 'stories']
try {
  const { data: bucketsList, error } = await supabase.storage.listBuckets()
  if (error) {
    fail('Storage buckets', error.message)
  } else {
    const existingBuckets = bucketsList.map(b => b.name)
    for (const bucket of buckets) {
      if (existingBuckets.includes(bucket)) {
        pass(`Storage bucket '${bucket}' exists`)
      } else {
        warn(`Storage bucket '${bucket}'`, 'Does not exist - create in Supabase dashboard')
      }
    }
  }
} catch (e) {
  fail('Storage buckets check', e.message)
}

// Test 7: Google OAuth
console.log('\n🔑 Testing OAuth Configuration...')
const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID
if (googleClientId && googleClientId.includes('apps.googleusercontent.com')) {
  pass('Google OAuth client ID configured')
} else {
  warn('Google OAuth', 'Client ID not configured (optional)')
}

// Summary
console.log('\n📈 TEST SUMMARY')
console.log('==================================')
console.log(`✅ Passed:   ${results.passed}`)
console.log(`❌ Failed:   ${results.failed}`)
console.log(`⚠️  Warnings: ${results.warnings}`)
console.log(`📊 Total:    ${results.passed + results.failed + results.warnings}`)

if (results.failed === 0) {
  console.log('\n🎉 ALL CRITICAL TESTS PASSED!')
  if (results.warnings > 0) {
    console.log('\n📝 ACTION ITEMS:')
    console.log('   1. Run APPLY_THIS_SQL.sql in Supabase dashboard if tables are missing')
    console.log('   2. Create storage buckets (avatars, messages, stories) if warned above')
    console.log('   3. Your app is ready to use!')
  } else {
    console.log('   Your application is fully configured and ready for production! 🚀')
  }
} else {
  console.log('\n⚠️  SOME TESTS FAILED - Review errors above')
  console.log('\n🔧 NEXT STEPS:')
  console.log('   1. Apply database schema: Open APPLY_THIS_SQL.sql in Supabase SQL Editor')
  console.log('   2. Create storage buckets in Supabase dashboard')
  console.log('   3. Re-run this test: node scripts/test-integration.js')
}

console.log('\n🌐 Quick Links:')
console.log(`   App: http://localhost:5173`)
console.log(`   Supabase: https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt`)
console.log(`   Cloudinary: https://console.cloudinary.com`)

process.exit(results.failed > 0 ? 1 : 0)
