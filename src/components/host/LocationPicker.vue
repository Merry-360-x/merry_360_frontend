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

    <!-- Map Container -->
    <div class="relative rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
      <div 
        ref="mapContainer" 
        class="w-full h-96 bg-gray-100 dark:bg-gray-800"
      ></div>
      
      <!-- Instructions Overlay -->
      <div class="absolute top-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 pointer-events-none">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-text-primary">Click on the map to set your property location</p>
            <p class="text-xs text-text-secondary mt-1">You can drag the marker to adjust the position</p>
          </div>
        </div>
      </div>

      <!-- Selected Location Info -->
      <div v-if="localLocation.lat != null && localLocation.lng != null" class="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-text-primary">Selected Location</p>
            <p class="text-xs text-text-secondary mt-1">
              {{ localLocation.lat.toFixed(6) }}, {{ localLocation.lng.toFixed(6) }}
            </p>
          </div>
          <button
            @click="clearLocation"
            type="button"
            class="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Address Input -->
    <div class="mt-6">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Street Address *
      </label>
      <input
        type="text"
        v-model="localAddress"
        @input="updateAddress"
        required
        placeholder="Enter your property address"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: null, lng: null })
  },
  price: {
    type: [Number, String],
    default: 0
  },
  address: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Where is your property located?'
  },
  subtitle: {
    type: String,
    default: 'Pin your exact location on the map'
  }
})

const emit = defineEmits(['update:modelValue', 'update:price', 'update:address'])

const mapContainer = ref(null)
const localLocation = ref({ ...props.modelValue })
const localPrice = ref(props.price || 0)
const localAddress = ref(props.address || '')

let map = null
let marker = null
let observer = null

const clampLat = (lat) => {
  if (!Number.isFinite(lat)) return null
  // Leaflet default CRS (EPSG:3857) supports roughly this latitude range
  return Math.max(-85.05112878, Math.min(85.05112878, lat))
}

const normalizeLng = (lng) => {
  if (!Number.isFinite(lng)) return null
  // Normalize to [-180, 180)
  return ((((lng + 180) % 360) + 360) % 360) - 180
}

const getTileConfig = () => {
  const key = String(import.meta.env.VITE_GEOAPIFY_API_KEY || '').trim()
  const hasKey = key && key !== 'your_geoapify_api_key_here'

  if (hasKey) {
    return {
      url: `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(key)}`,
      attribution: '© OpenStreetMap contributors © Geoapify'
    }
  }

  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  }
}

// Custom price marker icon
const createPriceMarkerIcon = (price) => {
  const priceText = price > 0 ? `$${price}` : '$0'
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="relative">
        <div class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
          <div class="bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg font-semibold text-sm whitespace-nowrap">
            ${priceText}
            <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div class="border-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
        <div class="w-10 h-10 bg-brand-500 border-4 border-white rounded-full shadow-lg"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })
}

const initMap = () => {
  if (!mapContainer.value) return
  // If the component is mounted inside a hidden step (v-show), Leaflet will compute a 0-size map.
  // Only initialize once the container has real dimensions.
  if (mapContainer.value.offsetWidth === 0 || mapContainer.value.offsetHeight === 0) return

  // Default center (you can change this to any location)
  const defaultCenter = props.modelValue.lat && props.modelValue.lng 
    ? [props.modelValue.lat, props.modelValue.lng]
    : [40.7128, -74.0060] // New York City default

  // Initialize map
  map = L.map(mapContainer.value).setView(defaultCenter, 13)

  const tiles = getTileConfig()

  L.tileLayer(tiles.url, {
    attribution: tiles.attribution,
    maxZoom: 19
  }).addTo(map)

  // Add marker if location exists
  if (props.modelValue.lat && props.modelValue.lng) {
    addMarker(props.modelValue.lat, props.modelValue.lng)
  }

  // Click event to place marker
  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    addMarker(lat, lng)
    updateLocation(lat, lng)
  })
}

const addMarker = (lat, lng) => {
  // Remove existing marker
  if (marker) {
    map.removeLayer(marker)
  }

  // Create new marker with price
  marker = L.marker([lat, lng], {
    icon: createPriceMarkerIcon(localPrice.value),
    draggable: true
  }).addTo(map)

  // Update location when marker is dragged
  marker.on('dragend', (e) => {
    const position = e.target.getLatLng()
    updateLocation(position.lat, position.lng)
  })
}

const updateLocation = (lat, lng) => {
  const safeLat = clampLat(Number(lat))
  const safeLng = normalizeLng(Number(lng))
  localLocation.value = { lat: safeLat, lng: safeLng }
  emit('update:modelValue', { lat: safeLat, lng: safeLng })
}

const updatePrice = () => {
  emit('update:price', parseFloat(localPrice.value) || 0)
  // Update marker icon with new price
  if (marker) {
    marker.setIcon(createPriceMarkerIcon(localPrice.value))
  }
}

const updateAddress = () => {
  emit('update:address', localAddress.value)
}

const clearLocation = () => {
  if (marker) {
    map.removeLayer(marker)
    marker = null
  }
  localLocation.value = { lat: null, lng: null }
  emit('update:modelValue', { lat: null, lng: null })
}

// Watch for external price changes
watch(() => props.price, (newPrice) => {
  localPrice.value = newPrice
  if (marker) {
    marker.setIcon(createPriceMarkerIcon(newPrice))
  }
})

// Watch for external location changes
watch(() => props.modelValue, (newLocation) => {
  if (newLocation.lat && newLocation.lng) {
    localLocation.value = { ...newLocation }
    if (map) {
      map.setView([newLocation.lat, newLocation.lng], 13)
      addMarker(newLocation.lat, newLocation.lng)
    }
  }
}, { deep: true })

onMounted(() => {
  const tryInit = () => {
    if (map) return
    initMap()
    if (map) {
      setTimeout(() => map?.invalidateSize(), 50)
      return
    }
    requestAnimationFrame(tryInit)
  }

  tryInit()

  // When Step 3 becomes visible again, fix layout and re-render tiles.
  if (mapContainer.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        setTimeout(() => map?.invalidateSize(), 50)
      },
      { threshold: 0.1 }
    )
    observer.observe(mapContainer.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  observer = null
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
.custom-price-marker {
  background: transparent;
  border: none;
}

.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  border-radius: 0.5rem;
}
</style>
