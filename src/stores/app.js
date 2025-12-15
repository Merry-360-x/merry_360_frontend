import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentLanguage = ref('en')
  const isAuthenticated = ref(false)
  const user = ref(null)
  
  // Detect system preference for dark mode
  const detectSystemPreference = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    return false
  }
  
  // Dark mode state - Auto-detect from system or use stored preference
  const storedDarkMode = localStorage.getItem('darkMode')
  const isDarkMode = ref(
    storedDarkMode !== null 
      ? storedDarkMode === 'true' 
      : detectSystemPreference()
  )

  // Listen for system theme changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeQuery.addEventListener('change', (e) => {
      // Only auto-update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        isDarkMode.value = e.matches
      }
    })
  }

  function setLanguage(lang) {
    currentLanguage.value = lang
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  function setDarkMode(value) {
    isDarkMode.value = value
  }

  // Watch for dark mode changes and update localStorage and document class
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('darkMode', newValue)
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  function login(userData) {
    isAuthenticated.value = true
    user.value = userData
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
  }

  return {
    currentLanguage,
    isAuthenticated,
    user,
    isDarkMode,
    setLanguage,
    login,
    logout,
    toggleDarkMode,
    setDarkMode
  }
})
