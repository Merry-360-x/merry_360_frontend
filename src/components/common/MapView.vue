<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-text-primary mb-2">Property Locations</h3>
      <p class="text-sm text-text-secondary mb-4">View properties with location data</p>
      
      <div v-if="properties && properties.length > 0" class="space-y-2">
        <div 
          v-for="property in properties" 
          :key="property.id"
          class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
          @click="selectProperty(property)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="font-medium text-text-primary">{{ property.title || property.name }}</p>
              <p class="text-sm text-text-secondary">{{ property.location }}</p>
              <p v-if="property.address" class="text-xs text-text-muted mt-1">
                📍 {{ property.address }}
              </p>
            </div>
            <div class="text-right ml-4">
              <p class="text-sm font-semibold text-text-primary">{{ formatPrice(property.price) }}</p>
              <button
                type="button"
                class="mt-1 px-3 py-1 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
                @click.stop="openDetails(property)"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
        <p class="text-text-secondary">No properties with location data available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCurrencyStore } from '@/stores/currency'

const props = defineProps({
  properties: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-property'])

const currencyStore = useCurrencyStore()
const selectedProperty = ref(null)

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const selectProperty = (property) => {
  selectedProperty.value = property
  emit('select-property', property)
}

const openDetails = (property) => {
  window.location.href = `/accommodations/${property.id}`
}
</script>
