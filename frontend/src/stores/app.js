import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentLanguage = ref('en')
  const isAuthenticated = ref(false)
  const user = ref(null)

  function setLanguage(lang) {
    currentLanguage.value = lang
  }

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
    setLanguage,
    login,
    logout
  }
})
