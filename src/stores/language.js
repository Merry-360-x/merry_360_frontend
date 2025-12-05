import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  // Get stored language or default to EN
  const storedLanguage = localStorage.getItem('merry360_language')
  const currentLanguage = ref(storedLanguage && ['EN', 'RW', 'FR', 'ZH', 'SW'].includes(storedLanguage) ? storedLanguage : 'EN')
  
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
