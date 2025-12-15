import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  // Detect browser language and map to supported languages
  const detectBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.userLanguage
    const langCode = browserLang.toLowerCase().split('-')[0]
    
    // Map browser language codes to our supported languages
    const languageMap = {
      'en': 'EN',
      'rw': 'RW',
      'fr': 'FR',
      'zh': 'ZH',
      'sw': 'SW'
    }
    
    return languageMap[langCode] || 'EN'
  }
  
  // Get stored language or auto-detect from browser
  const storedLanguage = localStorage.getItem('merry360_language')
  const detectedLanguage = detectBrowserLanguage()
  
  const currentLanguage = ref(
    storedLanguage && ['EN', 'RW', 'FR', 'ZH', 'SW'].includes(storedLanguage) 
      ? storedLanguage 
      : detectedLanguage
  )
  
  // Save auto-detected language if no stored preference
  if (!storedLanguage) {
    localStorage.setItem('merry360_language', currentLanguage.value)
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
    setLanguage,
    detectBrowserLanguage
  }
})
