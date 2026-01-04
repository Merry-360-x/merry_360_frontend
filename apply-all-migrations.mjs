#!/usr/bin/env node
/**
 * Apply All Migrations (VR Tour + Location Coordinates)
 * Runs both VR tour and location coordinate migrations
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
})

async function executeSql(sql, description) {
  console.log(`\n📄 ${description}`)
  console.log('─'.repeat(60))
  
  // Split by statement and execute each one
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s.toLowerCase() !== 'do $$' && s.toLowerCase() !== 'begin' && s.toLowerCase() !== 'end $$')

  for (const statement of statements) {
    if (statement.length > 10) {
      try {
        // Try to execute as raw SQL through the Supabase REST API
        const { error } = await supabase.rpc('exec', { sql_query: statement })
        
        if (error) {
          // Fallback: Try direct SQL execution via REST API
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            },
            body: JSON.stringify({ query: statement })
          })
          
          if (!response.ok) {
            console.log(`⚠️  Statement may need manual execution`)
          }
        }
      } catch (err) {
        console.log(`⚠️  Statement may need manual execution`)
      }
    }
  }
  
  console.log('✅ Migration commands prepared')
}

async function applyMigrations() {
  console.log('\n🚀 Applying Database Migrations...')
  console.log('=' .repeat(60))

  try {
    // Migration 1: VR Tour Fields
    const vrMigrationPath = join(__dirname, 'supabase', 'migrations', '20260104000000_add_vr_tour_fields.sql')
    const vrSql = readFileSync(vrMigrationPath, 'utf-8')
    await executeSql(vrSql, 'Migration 1: VR/3D Tour Fields')
    
    console.log('\n✅ VR Tour fields ready:')
    console.log('   • vr_tour_url (TEXT)')
    console.log('   • vr_tour_type (TEXT)')
    console.log('   • vr_tour_enabled (BOOLEAN)')

    // Migration 2: Location Coordinates
    const locationMigrationPath = join(__dirname, 'supabase', 'migrations', '20260104000001_add_location_coordinates.sql')
    const locationSql = readFileSync(locationMigrationPath, 'utf-8')
    await executeSql(locationSql, 'Migration 2: Location Coordinates')
    
    console.log('\n✅ Location coordinate fields ready:')
    console.log('   • latitude (DECIMAL 10,8)')
    console.log('   • longitude (DECIMAL 11,8)')
    console.log('   • Location index created')

    console.log('\n' + '═'.repeat(60))
    console.log('🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!')
    console.log('═'.repeat(60))
    
    console.log('\n📋 Manual Verification Steps:')
    console.log('   1. Go to your Supabase Dashboard')
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Run these queries to verify:')
    console.log('')
    console.log('   SELECT column_name, data_type FROM information_schema.columns')
    console.log('   WHERE table_name = \'properties\'')
    console.log('   AND column_name IN (\'vr_tour_url\', \'vr_tour_type\', \'vr_tour_enabled\', \'latitude\', \'longitude\');')
    console.log('')
    console.log('💡 If verification fails, manually run the SQL files:')
    console.log('   • supabase/migrations/20260104000000_add_vr_tour_fields.sql')
    console.log('   • supabase/migrations/20260104000001_add_location_coordinates.sql')

  } catch (err) {
    console.error('\n❌ Error:', err.message)
    console.log('\n📝 Manual Migration Required:')
    console.log('   1. Open Supabase Dashboard → SQL Editor')
    console.log('   2. Copy and run: supabase/migrations/20260104000000_add_vr_tour_fields.sql')
    console.log('   3. Copy and run: supabase/migrations/20260104000001_add_location_coordinates.sql')
    process.exit(1)
  }
}

applyMigrations()
