<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
    <div class="relative h-96 md:h-[600px] bg-gray-100 dark:bg-gray-900">
      <div v-if="!hasAnyCoords" class="absolute inset-0 flex items-center justify-center p-6">
        <div class="text-center max-w-md">
          <p class="font-semibold text-text-primary mb-1">Map unavailable</p>
          <p class="text-sm text-text-secondary">These properties don’t have coordinates yet.</p>
        </div>
      </div>

      <div
        v-if="selectedProperty"
        class="absolute left-4 right-4 bottom-4 z-10"
      >
        <div class="bg-white/95 dark:bg-gray-900/90 backdrop-blur rounded-xl shadow-card border border-gray-200/60 dark:border-gray-700 p-3 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-text-primary text-sm truncate">{{ selectedProperty.title || selectedProperty.name }}</p>
            <p class="text-xs text-text-secondary truncate">{{ selectedProperty.location }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-text-primary">{{ formatPrice(selectedProperty.price) }}</p>
          </div>
          <button
            type="button"
            class="h-9 px-3 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
            @click="openDetails"
          >
            View
          </button>
          <button
            type="button"
            class="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
            @click="clearSelection"
          >
            <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div ref="mapEl" class="absolute inset-0" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currency'

const props = defineProps({
  properties: {
    type: Array,
    default: () => []
  },
  selectedPropertyId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['selectProperty', 'openDetails', 'locationSearch'])

const currencyStore = useCurrencyStore()
const mapEl = ref(null)

let map = null
let markersLayer = null
let leafletLoadingPromise = null
const selectedPropertyId = ref(null)

const selectedProperty = computed(() => {
  if (selectedPropertyId.value == null) return null
  return props.properties.find((p) => String(p?.id) === String(selectedPropertyId.value)) || null
})

const formatPrice = (price) => currencyStore.formatPrice(price)

const hasAnyCoords = computed(() => {
  return props.properties.some((p) => Number.isFinite(Number(p?.latitude)) && Number.isFinite(Number(p?.longitude)))
})

const getCoords = (property) => {
  const lat = Number(property?.latitude)
  const lng = Number(property?.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

const loadLeaflet = () => {
  if (window.L) return Promise.resolve(window.L)
  if (leafletLoadingPromise) return leafletLoadingPromise

  leafletLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => resolve(window.L)
    script.onerror = () => reject(new Error('Failed to load Leaflet'))
    document.head.appendChild(script)
  })

  return leafletLoadingPromise
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

const ensureMap = async () => {
  if (!mapEl.value || map) return
  if (!hasAnyCoords.value) return

  const L = await loadLeaflet()
  map = L.map(mapEl.value, { zoomControl: false })

  L.control.zoom({ position: 'topright' }).addTo(map)

  const tiles = getTileConfig()

  L.tileLayer(tiles.url, {
    attribution: tiles.attribution,
    maxZoom: 19
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  // Ensure correct sizing when the component mounts inside conditional layouts
  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 0)
}

const makePriceIcon = (property, isSelected) => {
  const L = window.L
  const priceText = formatPrice(property?.price)
  const bubbleClass = isSelected ? 'merry-map-price-bubble merry-map-price-bubble--selected' : 'merry-map-price-bubble'

  return L.divIcon({
    className: 'merry-map-price-icon',
    html: `<div class="${bubbleClass}">${priceText}</div>`,
    iconSize: [0, 0]
  })
}

const renderMarkers = async () => {
  await ensureMap()
  if (!map || !markersLayer) return

  markersLayer.clearLayers()

  const L = window.L
  const bounds = []

  for (const property of props.properties) {
    const coords = getCoords(property)
    if (!coords) continue

    bounds.push([coords.lat, coords.lng])

    const isSelected = selectedPropertyId.value != null && String(property?.id) === String(selectedPropertyId.value)
    const marker = L.marker([coords.lat, coords.lng], {
      icon: makePriceIcon(property, isSelected)
    })

    marker.on('click', () => {
      selectedPropertyId.value = property?.id ?? null
      emit('selectProperty', property)
    })

    marker.addTo(markersLayer)
  }

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [32, 32] })
  }
}

onMounted(async () => {
  try {
    await renderMarkers()
  } catch (e) {
    console.error(e)
  }
})

watch(
  () => props.properties,
  async () => {
    try {
      await renderMarkers()
    } catch (e) {
      console.error(e)
    }
  },
  { deep: true }
)

watch(
  () => props.selectedPropertyId,
  async (next) => {
    selectedPropertyId.value = next
    try {
      await renderMarkers()
    } catch (e) {
      console.error(e)
    }
  },
  { immediate: true }
)

watch(
  () => selectedPropertyId.value,
  async () => {
    try {
      await renderMarkers()
    } catch (e) {
      console.error(e)
    }
  }
)

const openDetails = () => {
  if (!selectedProperty.value) return
  emit('openDetails', selectedProperty.value)
}

const clearSelection = () => {
  selectedPropertyId.value = null
  emit('selectProperty', null)
}

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
    markersLayer = null
  }
})
</script>
