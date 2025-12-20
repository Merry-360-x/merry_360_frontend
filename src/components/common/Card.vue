<template>
  <div :class="cardClasses" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hover: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-card transition-all duration-300 ease-out backdrop-blur-xl border border-gray-100'
  
  const paddingClasses = {
    none: '',
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClass = props.hover ? 'shadow-card hover:shadow-card-hover hover:border-brand-100 border-brand-500 transform hover:-translate-y-1' : 'shadow-card'
  const clickableClass = props.clickable ? 'cursor-pointer' : ''
  
  return [baseClasses, paddingClasses[props.padding], hoverClass, clickableClass].join(' ')
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
