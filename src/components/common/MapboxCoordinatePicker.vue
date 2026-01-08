<template>
  <div class="space-y-3">
    <div v-if="title" class="mb-2">
      <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-text-muted">{{ subtitle }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Property Address
      </label>
      <input
        type="text"
        v-model="localAddress"
        @input="updateAddress"
        placeholder="e.g., Kigali Convention Centre, KN 3 Ave, Kigali"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the full street address</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localAddress = ref(props.modelValue || '')

const updateAddress = () => {
  emit('update:modelValue', localAddress.value)
}

watch(
  () => props.modelValue,
  (newVal) => {
    localAddress.value = newVal || ''
  }
)
</script>
