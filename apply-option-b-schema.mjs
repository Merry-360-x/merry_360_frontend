import 'dotenv/config'
import pg from 'pg'
import { readFileSync } from 'fs'

const { Client } = pg

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ Missing SUPABASE_DB_URL (or DATABASE_URL) in environment')
  console.error('   Example: postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require')
  process.exit(1)
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

const migrationPath = './supabase/migrations/20260101190000_create_tours_vehicles_and_booking_links.sql'
const sql = readFileSync(migrationPath, 'utf8')

console.log('🔧 Connecting to Supabase database...')

try {
  await client.connect()
  console.log('✅ Connected successfully!')

  console.log(`\n📄 Applying migration: ${migrationPath}\n`)
  await client.query('BEGIN')
  await client.query(sql)
  await client.query('COMMIT')

  console.log('✅ Option B schema applied successfully!')
  console.log('   - Created tables: tours, vehicles')
  console.log('   - Added booking FKs: property_id, tour_id, vehicle_id')
  console.log('   - Added FK: properties.host_id -> profiles.id')
} catch (err) {
  try {
    await client.query('ROLLBACK')
  } catch {}

  console.error('❌ Failed applying Option B schema:', err?.message || err)
  process.exit(1)
} finally {
  await client.end()
}
