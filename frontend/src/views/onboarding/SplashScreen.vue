<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-500 overflow-hidden relative">
    <!-- Content -->
    <div class="text-center">
      <!-- Logo -->
      <div class="mb-8 flex justify-center">
        <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-32 w-auto drop-shadow-2xl" />
      </div>

      <!-- Brand Name -->
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
        Merry360X
      </h1>
      
      <!-- Tagline -->
      <p class="text-xl text-white text-opacity-90 mb-8">
        Discover Africa, Your Way
      </p>

      <!-- Loading Indicator -->
      <div class="flex justify-center items-center space-x-2">
        <div class="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
        <div class="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to welcome screen after 2.5 seconds
  setTimeout(() => {
    router.push('/welcome')
  }, 2500)
})
</script>

<style scoped>
.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-1000 {
  animation-delay: 1s;
}
</style>
