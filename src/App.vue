<template>
  <!-- Loading Spinner - Shows immediately while app loads -->
  <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="mb-6 flex justify-center">
        <img src="/merry-360-logo.png" alt="Merry360X" class="h-16 w-auto" />
      </div>
      <div class="flex justify-center items-center space-x-2">
        <div class="w-3 h-3 bg-brand-500 rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-brand-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-3 h-3 bg-brand-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  </div>
  
  <div v-else>
    <router-view />
    <ToastNotification />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from './stores/userStore'
import ToastNotification from './components/common/ToastNotification.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
import fastFetch from './services/fastFetch'
import { usePageVisibility } from './composables/usePageVisibility'
import { useButtonClickability } from './composables/useButtonClickability'

const userStore = useUserStore()
const isLoading = ref(true)

// Handle page visibility changes to fix button clickability issues
usePageVisibility()
// Ensure buttons are always clickable
useButtonClickability()

// Listen for page visibility events to restore UI state
let handlePageVisible = null

onMounted(async () => {
  // Show loading spinner immediately
  isLoading.value = true
  
  // Initialize auth and warmup cache in parallel
  try {
    await Promise.all([
      userStore.initAuth(),
      fastFetch.warmupCache().catch(() => {
        // Silently ignore cache warmup failures
      })
    ])
  } catch (err) {
    // Silently ignore initialization errors
  } finally {
    // Hide loading spinner after a minimum time to prevent flash
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
  
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
