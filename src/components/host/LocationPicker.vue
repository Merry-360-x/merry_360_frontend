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

      <div
        v-if="!hasMapboxToken"
        class="absolute inset-0 flex items-center justify-center p-6 bg-white/90 dark:bg-gray-900/90"
      >
        <div class="text-center max-w-sm">
          <p class="font-semibold text-text-primary mb-1">Map unavailable</p>
          <p class="text-sm text-text-secondary">Missing Mapbox token configuration.</p>
        </div>
      </div>
      
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
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN || ''
const hasMapboxToken = !!MAPBOX_TOKEN

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

const createMarkerElement = (price) => {
  const priceText = Number(price) > 0 ? `$${Number(price)}` : '$0'
  const el = document.createElement('div')
  el.className = 'merry-mapbox-marker'
  el.innerHTML = `
    <div class="relative">
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
        <div class="bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg font-semibold text-sm whitespace-nowrap">
          <span class="merry-mapbox-marker-price">${priceText}</span>
          <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div class="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      <div class="w-10 h-10 bg-brand-500 border-4 border-white rounded-full shadow-lg"></div>
    </div>
  `
  return el
}

const initMap = () => {
  if (!mapContainer.value) return

  if (!MAPBOX_TOKEN) {
    console.warn('Missing Mapbox token. Set VITE_MAPBOX_ACCESS_TOKEN to enable the map.')
    return
  }

  mapboxgl.accessToken = MAPBOX_TOKEN

  const hasInitial = props.modelValue.lat != null && props.modelValue.lng != null
  const defaultCenter = hasInitial
    ? [Number(props.modelValue.lng), Number(props.modelValue.lat)]
    : [-74.0060, 40.7128] // NYC default [lng, lat]

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: defaultCenter,
    zoom: 13
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-left')

  map.on('load', () => {
    if (hasInitial) {
      addMarker(Number(props.modelValue.lat), Number(props.modelValue.lng))
    }
  })

  map.on('click', (e) => {
    const lat = e.lngLat.lat
    const lng = e.lngLat.lng
    addMarker(lat, lng)
    updateLocation(lat, lng)
  })
}

const addMarker = (lat, lng) => {
  if (!map) return

  // Remove existing marker
  if (marker) marker.remove()

  const el = createMarkerElement(localPrice.value)
  marker = new mapboxgl.Marker({ element: el, draggable: true })
    .setLngLat([Number(lng), Number(lat)])
    .addTo(map)

  marker.on('dragend', () => {
    const pos = marker.getLngLat()
    updateLocation(pos.lat, pos.lng)
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
  if (marker) {
    const el = marker.getElement()
    const node = el?.querySelector?.('.merry-mapbox-marker-price')
    if (node) node.textContent = (Number(localPrice.value) > 0 ? `$${Number(localPrice.value)}` : '$0')
  }
}

const updateAddress = () => {
  emit('update:address', localAddress.value)
}

const clearLocation = () => {
  if (marker) {
    marker.remove()
    marker = null
  }
  localLocation.value = { lat: null, lng: null }
  emit('update:modelValue', { lat: null, lng: null })
}

// Watch for external price changes
watch(() => props.price, (newPrice) => {
  localPrice.value = newPrice
  if (marker) {
    const el = marker.getElement()
    const node = el?.querySelector?.('.merry-mapbox-marker-price')
    if (node) node.textContent = (Number(newPrice) > 0 ? `$${Number(newPrice)}` : '$0')
  }
})

// Watch for external location changes
watch(() => props.modelValue, (newLocation) => {
  if (newLocation?.lat != null && newLocation?.lng != null) {
    localLocation.value = { ...newLocation }
    if (map) {
      map.flyTo({ center: [Number(newLocation.lng), Number(newLocation.lat)], zoom: 13 })
      addMarker(Number(newLocation.lat), Number(newLocation.lng))
    }
  }
}, { deep: true })

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initMap()
  }, 100)
})
</script>

<style>
.merry-mapbox-marker {
  background: transparent;
  border: none;
}

.mapboxgl-canvas {
  outline: none;
}
</style>
