// Test host application submission
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const supabase = createClient(supabaseUrl, serviceRoleKey)

console.log('\n🧪 TESTING HOST APPLICATION SYSTEM')
console.log('═══════════════════════════════════\n')

async function testHostApplication() {
  console.log('📝 Creating test host application...\n')
  
  const testApplication = {
    full_name: 'Test Host',
    email: 'testhost@example.com',
    phone: '+250 788 123 456',
    location: 'Kigali, Rwanda',
    hosting_type: 'accommodation',
    description: 'I have a beautiful 3-bedroom villa near Lake Kivu with stunning sunset views. The property features modern amenities, a swimming pool, and a spacious garden. Perfect for families and couples looking for a peaceful retreat.',
    experience: 'some',
    status: 'pending',
    created_at: new Date().toISOString()
  }
  
  console.log('Application Details:')
  console.log('─────────────────────────────────')
  console.log(`Name: ${testApplication.full_name}`)
  console.log(`Email: ${testApplication.email}`)
  console.log(`Phone: ${testApplication.phone}`)
  console.log(`Location: ${testApplication.location}`)
  console.log(`Type: ${testApplication.hosting_type}`)
  console.log(`Experience: ${testApplication.experience}`)
  console.log('─────────────────────────────────\n')
  
  try {
    const { data, error } = await supabase
      .from('host_applications')
      .insert([testApplication])
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    console.log('✅ Test application created successfully!')
    console.log(`   Application ID: ${data.id}`)
    console.log(`   Created at: ${data.created_at}\n`)
    
    console.log('📧 Check the email service terminal for notification status...')
    console.log('📬 Check these inboxes:')
    console.log('   - Admin: admin@merry360x.com')
    console.log('   - Applicant: testhost@example.com\n')
    
    console.log('🔍 Verify in Supabase:')
    console.log('   SELECT * FROM host_applications ORDER BY created_at DESC LIMIT 1;\n')
    
    return data
  } catch (error) {
    console.error('❌ Error creating test application:', error.message)
    
    if (error.code === '42P01') {
      console.log('\n⚠️  Table does not exist!')
      console.log('   Run supabase-host-applications-table.sql in Supabase first.\n')
    } else if (error.code === '42501') {
      console.log('\n⚠️  Permission denied!')
      console.log('   Check RLS policies are set up correctly.\n')
    }
    
    throw error
  }
}

// Run the test
testHostApplication()
  .then(() => {
    console.log('✅ Test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  })
