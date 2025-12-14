import api from './api'
import { initFirebase, signInWithEmail, signUpWithEmail, googleSignIn, signOutUser, onAuthChange } from './firebase'
import * as supabaseService from './supabase'
import googleService from './google'
import mockApiService from './mockApi'
import jwtDecode from 'jwt-decode'

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true'
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true'

export async function signIn(credentials) {
  if (USE_FIREBASE) {
    const res = await signInWithEmail(credentials.email, credentials.password)
    const user = res.user
    const token = await user.getIdToken()
    return { user: { id: user.uid, email: user.email, firstName: user.displayName || '', lastName: '' }, token }
  }

  if (USE_SUPABASE) {
    const { data, error } = await supabaseService.signInWithEmail(credentials.email, credentials.password)
    if (error) throw error
    const token = data.session?.access_token
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || ''
      },
      token
    }
  }

  // Fallback to API
  return await api.auth.login(credentials)
}

export async function signUp(data) {
  if (USE_FIREBASE) {
    const res = await signUpWithEmail(data.email, data.password)
    const user = res.user
    const token = await user.getIdToken()
    return { user: { id: user.uid, email: user.email, firstName: user.displayName || '', lastName: '' }, token }
  }

  if (USE_SUPABASE) {
    const { data: authData, error } = await supabaseService.signUpWithEmail(data.email, data.password)
    if (error) throw error
    
    // Store additional profile data
    await supabaseService.setUserProfile(authData.user.id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      updated_at: new Date().toISOString()
    })

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
  if (USE_FIREBASE) {
    const res = await googleSignIn()
    const user = res.user
    const token = await user.getIdToken()
    return { user: { id: user.uid, email: user.email, firstName: user.displayName || '', lastName: '' }, token }
  }

  if (USE_SUPABASE) {
    // Supabase Google OAuth
    const { data, error } = await supabaseService.googleSignIn()
    if (error) throw error
    return {
      user: {
        id: data.user?.id || '',
        email: data.user?.email || '',
        firstName: data.user?.user_metadata?.firstName || '',
        lastName: data.user?.user_metadata?.lastName || ''
      }
    }
  }

  // Non-Firebase, Non-Supabase flow: use Google Identity Services (GSI)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('Social login not configured (VITE_GOOGLE_CLIENT_ID missing)')
  }

  return new Promise(async (resolve, reject) => {
    try {
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.left = '-9999px'
      document.body.appendChild(container)

      const callback = async (response) => {
        try {
          const idToken = response.credential
          const profile = jwtDecode(idToken)

          const backendRes = await mockApiService.auth.socialSignIn({
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            picture: profile.picture
          })

          document.body.removeChild(container)
          resolve(backendRes)
        } catch (err) {
          document.body.removeChild(container)
          reject(err)
        }
      }

      await googleService.renderGoogleButton({ clientId, element: container, callback })
    } catch (err) {
      reject(err)
    }
  })
}

export async function signOut() {
  if (USE_FIREBASE) {
    return await signOutUser()
  }

  if (USE_SUPABASE) {
    return await supabaseService.signOutUser()
  }

  return await api.auth.logout()
}

export function onAuthChanged(cb) {
  if (USE_FIREBASE) {
    return onAuthChange(cb)
  }

  if (USE_SUPABASE) {
    return supabaseService.onAuthChange(cb)
  }

  // For mock API, we don't have a real auth state listener
  const user = localStorage.getItem('user')
  setTimeout(() => cb(user ? JSON.parse(user) : null), 0)
  return () => {}
}

export default { signIn, signUp, signInWithGoogle, signOut, onAuthChanged }
