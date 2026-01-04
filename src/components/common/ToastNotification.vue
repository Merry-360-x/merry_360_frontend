<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden min-w-[320px] max-w-md transform transition-all duration-300 border border-gray-100 dark:border-gray-700"
        :class="toastClass(toast.type)"
      >
        <div class="flex items-center gap-3 p-4">
          <!-- Icon with background -->
          <div class="flex-shrink-0">
            <div v-if="toast.type === 'success'" class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div v-else-if="toast.type === 'error'" class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div v-else-if="toast.type === 'warning'" class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01"></path>
              </svg>
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01"></path>
              </svg>
            </div>
          </div>
          
          <!-- Message -->
          <div class="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ toast.message }}
          </div>
          
          <!-- Close Button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="h-1 bg-gray-100 dark:bg-gray-700">
          <div 
            class="h-full transition-all ease-linear"
            :class="progressBarClass(toast.type)"
            :style="{ width: '0%', animation: `progress ${toast.duration || 3000}ms linear forwards` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js'

const { toasts, removeToast } = useToast()

const toastClass = (type) => {
  // No longer using left border since we have icon backgrounds
  return ''
}

const progressBarClass = (type) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[type] || classes.info
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
