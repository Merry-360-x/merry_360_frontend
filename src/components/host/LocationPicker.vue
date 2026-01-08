<template>
  <div>
    <h3 class="text-2xl font-semibold text-text-primary mb-2">{{ title }}</h3>
    <p class="text-text-secondary mb-4">{{ subtitle }}</p>

    <!-- Price Input -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Price per night (USD) *
      </label>
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg font-semibold">$</span>
        <input
          type="number"
          v-model="localPrice"
          @input="updatePrice"
          min="0"
          step="1"
          required
          placeholder="0"
          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-lg"
        />
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Set your nightly rate</p>
    </div>

    <!-- Address Input -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Property Address *
        </label>
        <input
          type="text"
          v-model="localAddress"
          @input="updateLocation"
          placeholder="e.g., Kigali Convention Centre, KN 3 Ave, Kigali"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Enter the full street address including city and country
        </p>
      </div>
    </div>

    <div v-if="localAddress" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <p class="text-sm text-green-800 dark:text-green-300">
        ✓ Address set: {{ localAddress }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      address: '',
      price: null
    })
  },
  title: {
    type: String,
    default: 'Property Location & Price'
  },
  subtitle: {
    type: String,
    default: 'Set the location coordinates and pricing for your property'
  }
})

const emit = defineEmits(['update:modelValue'])

const localAddress = ref(props.modelValue?.address || '')
const localPrice = ref(props.modelValue?.price || null)

const updateLocation = () => {
  emit('update:modelValue', {
    address: localAddress.value,
    price: localPrice.value
  })
}

const updatePrice = () => {
  emit('update:modelValue', {
    address: localAddress.value,
    price: Number.isFinite(Number(localPrice.value)) ? Number(localPrice.value) : null
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      localAddress.value = newVal.address || ''
      localPrice.value = newVal.price || null
    }
  },
  { deep: true }
)
</script>
