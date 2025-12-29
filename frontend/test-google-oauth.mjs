import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Configuration\n')
  
  try {
    console.log('1️⃣ Attempting to initiate Google OAuth...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://www.merry360x.com/auth/callback`
      }
    })
    
    if (error) {
      console.error('❌ OAuth initiation failed:', error.message)
      console.error('Error details:', error)
      return
    }
    
    console.log('✅ OAuth initiation successful!')
    console.log('\n📋 OAuth Response:')
    console.log('   Provider:', data.provider)
    console.log('   Redirect URL:', data.url)
    
    if (data.url) {
      console.log('\n✅ Google OAuth is configured correctly!')
      console.log('🔗 User would be redirected to:', data.url.substring(0, 100) + '...')
      console.log('\n📝 Full redirect URL for testing:')
      console.log(data.url)
      console.log('\n✨ Test this URL in your browser to complete the OAuth flow!')
    } else {
      console.log('⚠️  No redirect URL returned - OAuth may not be configured in Supabase')
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    console.error('Full error:', err)
  }
}

testGoogleOAuth()
