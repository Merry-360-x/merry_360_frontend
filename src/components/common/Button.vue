<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    class="relative overflow-hidden"
  >
    <!-- Ripple Effect -->
    <span 
      v-for="ripple in ripples" 
      :key="ripple.id"
      class="absolute rounded-full bg-white opacity-30 pointer-events-none animate-ripple"
      :style="{
        left: ripple.x + 'px',
        top: ripple.y + 'px',
        width: ripple.size + 'px',
        height: ripple.size + 'px',
        transform: 'translate(-50%, -50%)'
      }"
    ></span>

    <!-- Success Checkmark Animation -->
    <span v-if="showSuccess" class="inline-block mr-2 animate-scale-in">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </span>

    <!-- Loading Spinner -->
    <span v-if="loading" class="inline-block animate-spin mr-2">
      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>

    <slot></slot>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'text', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Ripple effect state
const ripples = ref([])
let rippleId = 0

// Success animation state
const showSuccess = ref(props.success)

const buttonClasses = computed(() => {
  const baseClasses = 'font-semibold rounded-button transition-all duration-200 ease-out inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95'
  
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-brand-500 text-white shadow-card hover:shadow-card-hover focus:ring-brand-500',
    secondary: 'bg-white dark:bg-gray-800 text-text-primary border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-gray-800',
    text: 'text-brand-500 hover:text-brand-600',
    success: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600'
  }
  
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return [baseClasses, sizeClasses[props.size], variantClasses[props.variant], widthClass, disabledClass].join(' ')
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    // Create ripple effect
    createRipple(event)
    
    // Show success animation briefly
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 600)
    
    emit('click', event)
  }
}

const createRipple = (event) => {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const id = rippleId++
  const ripple = { id, x, y, size }
  
  ripples.value.push(ripple)
  
  // Remove ripple after animation
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)
}
</script>

<style scoped>
@keyframes ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>
