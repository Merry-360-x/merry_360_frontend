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

const userStore = useUserStore()

onMounted(() => {
  console.log('📱 App mounted - User Store State:')
  console.log('   isAuthenticated:', userStore.isAuthenticated)
  console.log('   user:', userStore.user)
  console.log('   localStorage user:', localStorage.getItem('user'))
  console.log('   localStorage isAuthenticated:', localStorage.getItem('isAuthenticated'))
})
</script>

<style>
/* Global styles are defined in style.css */
</style>
