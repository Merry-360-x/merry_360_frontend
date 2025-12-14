import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

// Initialize in light mode by default (dark mode only if explicitly set)
const isDarkMode = localStorage.getItem('darkMode') === 'true'
if (isDarkMode) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

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

app.mount('#app')
