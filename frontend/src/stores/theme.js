import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // Initialize from localStorage or system preference
  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // Set specific theme
  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  // Watch for changes
  watch(isDark, () => {
    applyTheme()
  })

  return {
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  }
})
