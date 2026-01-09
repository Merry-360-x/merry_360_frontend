import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { supabase } from './services/supabase'
import { initAlertToToast } from './lib/alertToToast'
import { isGlobalUploading } from './utils/globalUploadState'

// Scroll to top on initial page load
window.scrollTo(0, 0)

// Replace blocking alert() popups with toast notifications globally
initAlertToToast()

// Block closing/reloading while uploads are in progress
window.addEventListener('beforeunload', (e) => {
  if (!isGlobalUploading.value) return
  e.preventDefault()
  e.returnValue = ''
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores
import { useUserStore } from './stores/userStore'

// Initialize Supabase auth listener
const initSupabaseAuth = async () => {
  const store = useUserStore()

  // Hydrate state from existing session
  await store.initAuth()
  
  // Check for existing session on app load
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
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
        dateOfBirth: profile.date_of_birth || '',
        bio: profile.bio || '',
        studies: profile.studies || '',
        role: profile.role || 'user',
        avatar_url: profile.avatar_url || '',
        verified: true
      })
    }
  }
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
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
          dateOfBirth: profile.date_of_birth || '',
          bio: profile.bio || '',
          studies: profile.studies || '',
          role: profile.role || 'user',
          avatar_url: profile.avatar_url || '',
          verified: true
        })
      }
    } else if (event === 'SIGNED_OUT') {
      store.logout()
    }
  })
}

// Initialize Supabase auth
initSupabaseAuth()

// Pre-load critical data for faster page loads
import { preloadCriticalData } from './services/preloadData'
preloadCriticalData()

app.mount('#app')
