<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
      <component :is="icon" class="w-5 h-5" />
    </div>
    <div v-if="error" class="mt-1 text-sm text-error">{{ error }}</div>
    <div v-if="hint && !error" class="mt-1 text-sm text-text-muted">{{ hint }}</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isFocused = ref(false)

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-3 rounded-button border transition-all duration-200 ease-out focus:outline-none focus:ring-2 text-base placeholder:text-gray-400'
  const iconPadding = props.icon ? 'pl-11' : ''
  const errorClasses = props.error 
    ? 'border-error focus:ring-error focus:ring-opacity-20' 
    : 'border-gray-200 focus:border-primary focus:ring-primary focus:ring-opacity-20'
  const disabledClass = props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'
  
  return [baseClasses, iconPadding, errorClasses, disabledClass].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
