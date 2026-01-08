<template>
  <router-view />
  <ToastNotification />
  <ConfirmDialog />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from './stores/userStore'
import ToastNotification from './components/common/ToastNotification.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
import fastFetch from './services/fastFetch'
import { usePageVisibility } from './composables/usePageVisibility'

const userStore = useUserStore()

// Handle page visibility changes to fix button clickability issues
usePageVisibility()

// Listen for page visibility events to restore UI state
let handlePageVisible = null

onMounted(() => {
  console.log('📱 App mounted - User Store State:')
  console.log('   isAuthenticated:', userStore.isAuthenticated)
  console.log('   user:', userStore.user)
  console.log('   localStorage user:', localStorage.getItem('user'))
  console.log('   localStorage isAuthenticated:', localStorage.getItem('isAuthenticated'))
  
  // Warmup cache for ultra-fast page loads
  fastFetch.warmupCache().then(() => {
    console.log('⚡ Cache warmed up - data ready for instant access')
  }).catch(err => {
    console.warn('Cache warmup failed:', err)
  })
  
  // Handle page visibility changes to restore UI state
  handlePageVisible = () => {
    // Ensure body scroll is not locked when page becomes visible
    const body = document.body
    const hasOpenModal = document.querySelector('.modal-open, .dialog-open, [data-modal-open="true"]')
    
    if (!hasOpenModal && body.style.overflow === 'hidden') {
      body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    
    // Force a reflow to ensure buttons are clickable
    void body.offsetHeight
  }
  
  window.addEventListener('pagevisible', handlePageVisible)
  window.addEventListener('windowfocused', handlePageVisible)
})

onBeforeUnmount(() => {
  if (handlePageVisible) {
    window.removeEventListener('pagevisible', handlePageVisible)
    window.removeEventListener('windowfocused', handlePageVisible)
  }
})
</script>

<style>
/* Global styles are defined in style.css */
</style>
