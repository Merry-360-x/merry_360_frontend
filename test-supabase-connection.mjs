#!/usr/bin/env node

/**
 * Supabase Database Connection Test
 * Tests a direct Postgres connection using a connection string from environment variables.
 *
 * Required env var (choose one):
 * - SUPABASE_DB_URL (recommended)
 * - DATABASE_URL
 */

import 'dotenv/config'
import pg from 'pg'
const { Client } = pg

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('\n❌ Missing database connection string')
  console.error('Set SUPABASE_DB_URL (recommended) or DATABASE_URL in your .env')
  process.exit(1)
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Supabase Database Connection...\n')
  let parsed
  try {
    parsed = new URL(connectionString)
  } catch {
    parsed = null
  }

  const host = parsed?.hostname || '(unknown)'
  const port = parsed?.port || '(default)'
  const database = (parsed?.pathname || '').replace(/^\//, '') || '(unknown)'
  const username = parsed?.username || '(unknown)'

  // Hosted Supabase Postgres requires SSL. We enable it automatically when it looks like hosted.
  const useSsl = Boolean(parsed && /\.supabase\.co$/i.test(host))

  console.log('Connection Details (sanitized):')
  console.log(`  Host: ${host}`)
  console.log(`  Port: ${port}`)
  console.log(`  Database: ${database}`)
  console.log(`  User: ${username}`)
  console.log(`  SSL: ${useSsl ? 'enabled' : 'disabled'}`)
  console.log('  Source: env (SUPABASE_DB_URL/DATABASE_URL)\n')

  const client = new Client({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })

  try {
    // Connect to database
    console.log('⏳ Connecting to database...')
    await client.connect()
    console.log('✅ Successfully connected to Supabase database!\n')

    // Test 1: Check database version
    console.log('📊 Test 1: Checking PostgreSQL version...')
    const versionResult = await client.query('SELECT version()')
    console.log(`   Version: ${versionResult.rows[0].version}\n`)

    // Test 2: List all tables
    console.log('📋 Test 2: Listing all tables in public schema...')
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No tables found in public schema\n')
    } else {
      console.log(`   Found ${tablesResult.rows.length} tables:`)
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
      console.log('')
    }

    // Test 3: Check for profiles table
    console.log('👤 Test 3: Checking for profiles table...')
    const profilesCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      )
    `)
    
    if (profilesCheck.rows[0].exists) {
      console.log('   ✅ profiles table exists')
      
      // Get profile count
      const countResult = await client.query('SELECT COUNT(*) FROM profiles')
      console.log(`   📊 Total profiles: ${countResult.rows[0].count}\n`)
    } else {
      console.log('   ⚠️  profiles table does not exist\n')
    }

    // Test 4: Check authentication schema
    console.log('🔐 Test 4: Checking auth schema...')
    const authCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.schemata 
        WHERE schema_name = 'auth'
      )
    `)
    
    if (authCheck.rows[0].exists) {
      console.log('   ✅ auth schema exists')
      
      // Check for users table in auth schema
      const usersCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'auth' 
          AND table_name = 'users'
        )
      `)
      
      if (usersCheck.rows[0].exists) {
        const userCount = await client.query('SELECT COUNT(*) FROM auth.users')
        console.log(`   👥 Total users: ${userCount.rows[0].count}\n`)
      }
    } else {
      console.log('   ⚠️  auth schema does not exist\n')
    }

    // Test 5: Check database size
    console.log('💾 Test 5: Checking database size...')
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size('postgres')) as size
    `)
    console.log(`   Database size: ${sizeResult.rows[0].size}\n`)

    // Final summary
    console.log('═══════════════════════════════════════════════════════')
    console.log('✅ DATABASE CONNECTION TEST PASSED')
    console.log('═══════════════════════════════════════════════════════')
    console.log('✓ Connection established successfully')
    console.log('✓ PostgreSQL database is accessible')
    console.log('✓ Database queries are working correctly')
    console.log('✓ 100% CONNECTED TO SUPABASE DATABASE')
    console.log('═══════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('\n❌ Database Connection Error:')
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'N/A'}`)
    console.error(`\n   Troubleshooting:`)
    console.error(`   - Check if the database URL is correct`)
    console.error(`   - Verify the password contains no special characters that need escaping`)
    console.error(`   - Ensure your IP is whitelisted in Supabase settings`)
    console.error(`   - Confirm the database is running and accessible\n`)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the test
testDatabaseConnection()
