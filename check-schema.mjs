import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.vercel.production' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkSchema() {
  console.log('🔍 Checking properties table schema...\n')
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Error:', error.message)
  } else if (data && data[0]) {
    console.log('Available columns:')
    Object.keys(data[0]).forEach(key => console.log(`  - ${key}`))
  } else {
    console.log('No properties found, cannot check columns')
  }
}

checkSchema()
