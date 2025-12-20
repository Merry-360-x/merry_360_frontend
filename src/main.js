import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { supabase } from './services/supabase'

// Scroll to top on initial page load
window.scrollTo(0, 0)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Firebase auth listener if configured
import { onAuthChanged } from './services/auth'
import { useUserStore } from './stores/userStore'

if (import.meta.env.VITE_USE_FIREBASE === 'true') {
  const store = useUserStore()
  onAuthChanged((user) => {
    if (user) {
      // If a firebase user object, create normalized structure
      const normalized = {
        id: user.uid || user.id,
        email: user.email,
        firstName: user.displayName || user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      }
      store.login(normalized)
      localStorage.setItem('user', JSON.stringify(normalized))
    } else {
      // not signed in
      store.logout()
    }
  })
}

// Initialize Supabase auth listener
const initSupabaseAuth = async () => {
  const store = useUserStore()
  
  // Check for existing session on app load
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    console.log('✅ Existing session found:', session.user.email)
    
    // Load user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (profile) {
      await store.login({
        id: session.user.id,
        email: session.user.email,
        name: `${profile.first_name} ${profile.last_name}`,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        role: profile.role || 'user',
        avatarUrl: profile.avatar_url || '',
        verified: true
      })
      
      localStorage.setItem('auth_token', session.access_token)
    }
  }
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔔 Auth state changed:', event)
    
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('✅ User signed in:', session.user.email)
      
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profile) {
        await store.login({
          id: session.user.id,
          email: session.user.email,
          name: `${profile.first_name} ${profile.last_name}`,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          role: profile.role || 'user',
          avatarUrl: profile.avatar_url || '',
          verified: true
        })
        
        localStorage.setItem('auth_token', session.access_token)
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 User signed out')
      store.logout()
    }
  })
}

// Initialize Supabase auth
initSupabaseAuth()

app.mount('#app')
