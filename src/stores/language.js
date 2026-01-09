import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  // Get stored language - default to English if not set
  const storedLanguage = localStorage.getItem('merry360_language')
  
  // Always default to English - users can manually change language
  const currentLanguage = ref(
    storedLanguage && ['EN', 'RW', 'FR', 'ZH', 'SW'].includes(storedLanguage) 
      ? storedLanguage 
      : 'EN'
  )
  
  // Save default language if no stored preference
  if (!storedLanguage) {
    localStorage.setItem('merry360_language', 'EN')
  }
  
  // Change language
  const setLanguage = (lang) => {
    if (['EN', 'RW', 'FR', 'ZH', 'SW'].includes(lang)) {
      currentLanguage.value = lang
      localStorage.setItem('merry360_language', lang)
    }
  }
  
  return {
    currentLanguage,
    setLanguage
  }
})
