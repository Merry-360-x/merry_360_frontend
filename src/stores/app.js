import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentLanguage = ref('en')
  const isAuthenticated = ref(false)
  const user = ref(null)
  
  // Dark mode state
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true' || false)

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
