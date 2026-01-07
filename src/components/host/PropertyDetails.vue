<template>
  <div>
    <h3 class="text-2xl font-semibold text-text-primary mb-2">{{ title }}</h3>
    <p class="text-text-secondary mb-8">{{ subtitle }}</p>

    <div class="space-y-6">
      <!-- Guests -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div class="text-base font-medium text-text-primary">Guests</div>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="decrement('guests')"
            :disabled="details.guests <= 1"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.guests <= 1
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center font-medium text-text-primary">{{ details.guests }}</span>
          <button
            @click="increment('guests')"
            :disabled="details.guests >= maxGuests"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.guests >= maxGuests
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Bedrooms -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div class="text-base font-medium text-text-primary">Bedrooms</div>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="decrement('bedrooms')"
            :disabled="details.bedrooms <= 0"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.bedrooms <= 0
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center font-medium text-text-primary">{{ details.bedrooms }}</span>
          <button
            @click="increment('bedrooms')"
            :disabled="details.bedrooms >= maxBedrooms"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.bedrooms >= maxBedrooms
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Beds -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div class="text-base font-medium text-text-primary">Beds</div>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="decrement('beds')"
            :disabled="details.beds <= 1"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.beds <= 1
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center font-medium text-text-primary">{{ details.beds }}</span>
          <button
            @click="increment('beds')"
            :disabled="details.beds >= maxBeds"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.beds >= maxBeds
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Bathrooms -->
      <div class="flex items-center justify-between py-4">
        <div>
          <div class="text-base font-medium text-text-primary">Bathrooms</div>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="decrement('bathrooms')"
            :disabled="details.bathrooms <= 0.5"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.bathrooms <= 0.5
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center font-medium text-text-primary">{{ details.bathrooms }}</span>
          <button
            @click="increment('bathrooms')"
            :disabled="details.bathrooms >= maxBathrooms"
            :class="[
              'w-8 h-8 rounded-full border flex items-center justify-center transition-all',
              details.bathrooms >= maxBathrooms
                ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-400 dark:border-gray-500 text-text-primary hover:border-gray-900 dark:hover:border-gray-100'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ guests: 4, bedrooms: 1, beds: 1, bathrooms: 1 })
  },
  title: {
    type: String,
    default: 'Share some basics about your place'
  },
  subtitle: {
    type: String,
    default: "You'll add more details later, like bed types."
  },
  maxGuests: {
    type: Number,
    default: 16
  },
  maxBedrooms: {
    type: Number,
    default: 50
  },
  maxBeds: {
    type: Number,
    default: 50
  },
  maxBathrooms: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['update:modelValue'])

const details = reactive({ ...props.modelValue })

const increment = (field) => {
  if (field === 'bathrooms') {
    details[field] = Math.min(details[field] + 0.5, props[`max${field.charAt(0).toUpperCase() + field.slice(1)}`] || 50)
  } else {
    const maxField = `max${field.charAt(0).toUpperCase() + field.slice(1)}`
    details[field] = Math.min(details[field] + 1, props[maxField] || 50)
  }
  emit('update:modelValue', { ...details })
}

const decrement = (field) => {
  if (field === 'bathrooms') {
    details[field] = Math.max(details[field] - 0.5, 0.5)
  } else {
    const minValue = (field === 'guests' || field === 'beds') ? 1 : 0
    details[field] = Math.max(details[field] - 1, minValue)
  }
  emit('update:modelValue', { ...details })
}

watch(() => props.modelValue, (newVal) => {
  Object.assign(details, newVal)
}, { deep: true })
</script>
