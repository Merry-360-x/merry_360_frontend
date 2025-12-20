import pg from 'pg'
const { Client } = pg

const client = new Client({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.gzmxelgcdpaeklmabszo',
  password: 'HF8Q97jsSj0LS3n1',
  ssl: { rejectUnauthorized: false }
})

console.log('🔧 Connecting to Supabase database...')

try {
  await client.connect()
  console.log('✅ Connected successfully!\n')
  
  console.log('📄 Applying migration: Add host application fields...\n')
  
  // Execute the ALTER TABLE statement
  await client.query(`
    ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS host_application_status TEXT CHECK (host_application_status IN ('pending', 'approved', 'rejected')),
    ADD COLUMN IF NOT EXISTS host_application_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS host_approved_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS host_rejected_date TIMESTAMPTZ;
  `)
  console.log('✅ Columns added to profiles table')
  
  // Create index
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profiles_host_application_status ON profiles(host_application_status);
  `)
  console.log('✅ Index created')
  
  // Add comments
  await client.query(`COMMENT ON COLUMN profiles.host_application_status IS 'Status of host application: pending, approved, or rejected';`)
  await client.query(`COMMENT ON COLUMN profiles.host_application_date IS 'When the user applied to become a host';`)
  await client.query(`COMMENT ON COLUMN profiles.host_approved_date IS 'When the host application was approved';`)
  await client.query(`COMMENT ON COLUMN profiles.host_rejected_date IS 'When the host application was rejected';`)
  console.log('✅ Column comments added')
  
  console.log('\n🎉 Migration completed successfully!\n')
  console.log('📋 New columns added to profiles table:')
  console.log('   - host_application_status (pending/approved/rejected)')
  console.log('   - host_application_date')
  console.log('   - host_approved_date')
  console.log('   - host_rejected_date\n')
  console.log('🔗 Test the feature at:')
  console.log('   https://merry-360-frontend-c42eohgfs-das-48ca2629.vercel.app/admin/host-applications\n')
  
} catch (err) {
  console.error('❌ Migration failed:', err.message)
  console.error('\n📝 Error details:', err)
  process.exit(1)
} finally {
  await client.end()
}
