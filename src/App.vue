<template>
  <!-- Global Loading Overlay -->
  <div v-if="isPreloading" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
      <h2 class="text-xl font-semibold text-text-primary mb-2">Loading Merry 360</h2>
      <p class="text-text-secondary text-sm">Preparing your experience...</p>
    </div>
  </div>

  <router-view />
  <ToastNotification />
  <ConfirmDialog />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/userStore'
import ToastNotification from './components/common/ToastNotification.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
import { waitForPreload } from './services/preloadData'

const userStore = useUserStore()
const isPreloading = ref(true)

onMounted(async () => {
  console.log('📱 App mounted - User Store State:')
  console.log('   isAuthenticated:', userStore.isAuthenticated)
  console.log('   user:', userStore.user)
  console.log('   localStorage user:', localStorage.getItem('user'))
  console.log('   localStorage isAuthenticated:', localStorage.getItem('isAuthenticated'))
  
  // Wait for preload and hide spinner
  await waitForPreload()
  setTimeout(() => {
    isPreloading.value = false
  }, 300) // Brief delay for smooth transition
})
</script>

<style>
/* Global styles are defined in style.css */
</style>
