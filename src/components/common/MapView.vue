<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
    <div class="p-4 bg-gradient-to-r from-teal-500 to-cyan-600">
      <h3 class="text-white font-bold text-lg flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        Map View
      </h3>
      <p class="text-white/90 text-sm mt-1">{{ properties.length }} properties in this area</p>
    </div>
    
    <!-- Placeholder Map -->
    <div class="relative h-96 bg-gray-100">
      <!-- Mock map with markers -->
      <div class="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100">
        <!-- Grid pattern to simulate map -->
        <div class="absolute inset-0 opacity-10">
          <div class="grid grid-cols-8 grid-rows-8 h-full">
            <div v-for="i in 64" :key="i" class="border border-gray-400"></div>
          </div>
        </div>
        
        <!-- Mock markers -->
        <div 
          v-for="(property, index) in properties.slice(0, 8)" 
          :key="property.id"
          :style="{ 
            position: 'absolute', 
            left: `${20 + (index % 4) * 20}%`, 
            top: `${20 + Math.floor(index / 4) * 40}%` 
          }"
          class="group cursor-pointer"
          @click="selectProperty(property)"
        >
          <!-- Marker Pin -->
          <div class="relative">
            <svg class="w-8 h-8 text-teal-600 drop-shadow-lg transform transition-transform group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            
            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-[200px]">
                <p class="font-bold text-sm text-gray-900 mb-1">{{ property.title }}</p>
                <p class="text-xs text-gray-600 mb-2">{{ property.location }}</p>
                <p class="text-teal-600 font-bold text-sm">{{ formatPrice(property.price) }}/night</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Controls -->
        <div class="absolute top-4 right-4 flex flex-col gap-2">
          <button class="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg class="w-5 h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button class="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
          </button>
        </div>

        <!-- Location Search -->
        <div class="absolute top-4 left-4 right-20">
          <div class="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              v-model="searchLocation"
              type="text" 
              placeholder="Search location..."
              class="flex-1 outline-none text-sm"
              @input="handleLocationSearch"
            />
          </div>
        </div>
      </div>

      <!-- Note about map integration -->
      <div class="absolute bottom-4 left-4 right-4">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p class="text-xs text-gray-600">
            <span class="font-semibold">💡 Tip:</span> Click on markers to view property details. Integration with Google Maps/Mapbox can be added.
          </p>
        </div>
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

const emit = defineEmits(['selectProperty', 'locationSearch'])

const currencyStore = useCurrencyStore()
const searchLocation = ref('')

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const selectProperty = (property) => {
  emit('selectProperty', property)
}

const handleLocationSearch = () => {
  emit('locationSearch', searchLocation.value)
}
</script>
