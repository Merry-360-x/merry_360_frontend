#!/usr/bin/env node
/**
 * Apply VR Tour Migration
 * Adds VR/3D tour fields to the properties table
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function applyMigration() {
  console.log('🚀 Applying VR Tour Migration...')
  console.log('')

  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20260104000000_add_vr_tour_fields.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('📄 Migration SQL:')
    console.log(sql)
    console.log('')

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // If exec_sql RPC doesn't exist, try direct execution (may not work with all queries)
      console.log('⚠️  exec_sql RPC not found, trying direct execution...')
      
      // Split by semicolon and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'))

      for (const statement of statements) {
        if (statement.length > 0) {
          const { error: execError } = await supabase.rpc('exec', { query: statement })
          if (execError) {
            console.error('❌ Error executing statement:', execError)
            throw execError
          }
        }
      }
    }

    console.log('✅ Migration applied successfully!')
    console.log('')
    console.log('📊 VR Tour fields added:')
    console.log('   - vr_tour_url (TEXT)')
    console.log('   - vr_tour_type (TEXT with CHECK constraint)')
    console.log('   - vr_tour_enabled (BOOLEAN, default: false)')
    console.log('')
    console.log('🎉 You can now add VR/3D tours to properties!')
    console.log('   Supported platforms: Matterport, Google Tour, YouTube 360°, Custom')

  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    console.error('')
    console.error('📝 Manual Migration Instructions:')
    console.error('   1. Go to your Supabase Dashboard')
    console.error('   2. Navigate to SQL Editor')
    console.error('   3. Copy and paste the contents of:')
    console.error('      supabase/migrations/20260104000000_add_vr_tour_fields.sql')
    console.error('   4. Click "Run" to execute the migration')
    process.exit(1)
  }
}

applyMigration()
