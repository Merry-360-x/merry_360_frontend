<template>
  <router-view />
  <ToastNotification />
  <ConfirmDialog />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'
import ToastNotification from './components/common/ToastNotification.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
import fastFetch from './services/fastFetch'

const userStore = useUserStore()

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
})
</script>

<style>
/* Global styles are defined in style.css */
</style>
