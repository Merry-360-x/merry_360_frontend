import api from './api'
import * as supabaseService from './supabase'
import mockApiService from './mockApi'

const USE_FIREBASE = false
const USE_SUPABASE = String(import.meta.env.VITE_USE_SUPABASE || '').trim() === 'true'

// Debug logging for environment variables
console.log('🔧 Auth Service Environment:', {
  USE_FIREBASE,
  USE_SUPABASE,
  VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
})

export async function signIn(credentials) {
  console.log('🔵 signIn called with:', credentials.email)
  
  // Check if admin email
  const isAdmin = credentials.email === 'admin@merry360x.com' || credentials.email === 'bebisdavy@gmail.com'
  
  if (USE_SUPABASE) {
    console.log('🔧 Using Supabase for sign in')
    const { data, error } = await supabaseService.signInWithEmail(credentials.email, credentials.password)
    if (error) {
      console.error('❌ Supabase sign in error:', error)
      throw error
    }
    console.log('✅ Supabase sign in successful')
    const token = data.session?.access_token
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || '',
        role: isAdmin ? 'admin' : (data.user.user_metadata?.role || 'user')
      },
      token
    }
  }

  // Fallback to API
  const response = await api.auth.login(credentials)
  // Override role for admin emails
  if (isAdmin && response.user) {
    response.user.role = 'admin'
  }
  return response
}

export async function signUp(data) {
  if (USE_SUPABASE) {
    // Pass user metadata during signup so it's available to the trigger
    const { data: authData, error } = await supabaseService.signUpWithEmail(
      data.email, 
      data.password,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      }
    )
    if (error) throw error
    
    // Also manually set profile data as backup (in case trigger doesn't run)
    // This will be upserted, so it won't conflict with trigger-created profile
    try {
      await supabaseService.setUserProfile(authData.user.id, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        updated_at: new Date().toISOString()
      })
    } catch (profileError) {
      console.warn('Profile creation warning:', profileError)
      // Don't throw - profile might already exist from trigger
    }

    const token = authData.session?.access_token
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: data.firstName,
        lastName: data.lastName
      },
      token
    }
  }

  return await api.auth.signup(data)
}

export async function signInWithGoogle() {
  console.log('🔧 signInWithGoogle called - USE_FIREBASE:', USE_FIREBASE, 'USE_SUPABASE:', USE_SUPABASE)
  
  if (USE_SUPABASE) {
    console.log('🔧 Using Supabase OAuth')
    // Supabase Google OAuth - this will redirect the browser to Google
    await supabaseService.googleSignIn()
    // Note: Code after this won't execute because browser redirects to Google
    // User will come back to /auth/callback after Google authentication
    return
  }

  // No OAuth configured
  console.error('❌ Neither Firebase nor Supabase is enabled!')
  console.error('Environment check:', {
    VITE_USE_FIREBASE: import.meta.env.VITE_USE_FIREBASE,
    VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE
  })
  throw new Error('Google sign-in not configured. Please enable Firebase or Supabase.')
}

export async function signOut() {
  if (USE_SUPABASE) {
    return await supabaseService.signOutUser()
  }

  return await api.auth.logout()
}

export function onAuthChanged(cb) {
  if (USE_SUPABASE) {
    return supabaseService.onAuthChange(cb)
  }

  // For mock API, we don't have a real auth state listener
  const user = localStorage.getItem('user')
  setTimeout(() => cb(user ? JSON.parse(user) : null), 0)
  return () => {}
}

export default { signIn, signUp, signInWithGoogle, signOut, onAuthChanged }
