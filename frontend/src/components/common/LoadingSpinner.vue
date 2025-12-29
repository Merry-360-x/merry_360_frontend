<template>
  <div class="flex items-center justify-center" :class="sizeClass">
    <svg class="animate-spin" :class="[colorClass, sizeClass]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-if="text" class="ml-2" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'text-brand-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }
  return colors[props.color] || colors.primary
})

const textClass = computed(() => {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return textSizes[props.size]
})
</script>
