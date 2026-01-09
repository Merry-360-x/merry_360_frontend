import api from './api'
import * as supabaseService from './supabase'

const USE_FIREBASE = false
const USE_SUPABASE = String(import.meta.env.VITE_USE_SUPABASE || '').trim() === 'true'

async function bestEffort(promise, { timeoutMs = 2500, label = 'operation' } = {}) {
  let timer = null
  try {
    await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs)
      })
    ])
  } catch (err) {
    // Silently ignore best-effort failures
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function signIn(credentials) {
  if (USE_SUPABASE) {
    const { data, error } = await supabaseService.signInWithEmail(credentials.email, credentials.password)
    if (error) {
      throw error
    }
    
    // Fetch role from database profile (SECURE - not client-side email check)
    let userRole = 'user'
    try {
      const { data: profile } = await supabaseService.supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      if (profile?.role) {
        userRole = profile.role
      }
    } catch (profileErr) {
      // Profile might not exist yet, default to user role
    }
    
    const token = data.session?.access_token
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || '',
        role: userRole
      },
      token
    }
  }

  // Fallback to API
  const response = await api.auth.login(credentials)
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
  if (USE_SUPABASE) {
    // Supabase Google OAuth - this will redirect the browser to Google
    await supabaseService.googleSignIn()
    // Note: Code after this won't execute because browser redirects to Google
    // User will come back to /auth/callback after Google authentication
    return
  }

  // No OAuth configured
  throw new Error('Google sign-in not configured. Please enable Firebase or Supabase.')
}

export async function signOut() {
  // Always attempt to clear Supabase session (best-effort), because the app
  // initializes a Supabase auth listener regardless of USE_SUPABASE.
  await bestEffort(supabaseService.signOutUser(), {
    timeoutMs: 2500,
    label: 'Supabase sign out'
  })

  // If we're using Supabase-only auth, we're done.
  if (USE_SUPABASE) return

  // API logout is best-effort: never block the UI on this.
  await bestEffort(api.auth.logout(), {
    timeoutMs: 2500,
    label: 'Server logout'
  })
}

export function onAuthChanged(cb) {
  if (USE_SUPABASE) {
    return supabaseService.onAuthChange(cb)
  }

  // Fallback: check localStorage for user session
  const user = localStorage.getItem('user')
  setTimeout(() => cb(user ? JSON.parse(user) : null), 0)
  return () => {}
}

export default { signIn, signUp, signInWithGoogle, signOut, onAuthChanged }
