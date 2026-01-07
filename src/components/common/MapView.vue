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
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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
let markers = []
const selectedPropertyId = ref(null)

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN || ''

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

const ensureMap = async () => {
  if (!mapEl.value || map) return
  if (!hasAnyCoords.value) return

  if (!MAPBOX_TOKEN) {
    console.warn('Missing Mapbox token. Set VITE_MAPBOX_ACCESS_TOKEN to enable the map.')
    return
  }

  mapboxgl.accessToken = MAPBOX_TOKEN

  // Pick the first valid coordinate as the initial center
  const first = props.properties.map(getCoords).find(Boolean)
  const center = first ? [first.lng, first.lat] : [0, 0]

  map = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom: first ? 8 : 2
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Ensure correct sizing when the component mounts inside conditional layouts
  setTimeout(() => {
    if (map) map.resize()
  }, 0)
}

const makeMarkerElement = (property, isSelected) => {
  const el = document.createElement('div')
  const priceText = formatPrice(property?.price)
  const bubbleClass = isSelected
    ? 'merry-map-price-bubble merry-map-price-bubble--selected'
    : 'merry-map-price-bubble'
  el.innerHTML = `<div class="${bubbleClass}">${priceText}</div>`
  el.style.cursor = 'pointer'
  return el
}

const renderMarkers = async () => {
  await ensureMap()
  if (!map) return

  // Clear old markers
  for (const m of markers) m.remove()
  markers = []

  let bounds = null

  for (const property of props.properties) {
    const coords = getCoords(property)
    if (!coords) continue

    if (!bounds) bounds = new mapboxgl.LngLatBounds()
    bounds.extend([coords.lng, coords.lat])

    const isSelected = selectedPropertyId.value != null && String(property?.id) === String(selectedPropertyId.value)

    const el = makeMarkerElement(property, isSelected)
    el.addEventListener('click', () => {
      selectedPropertyId.value = property?.id ?? null
      emit('selectProperty', property)
    })

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map)

    markers.push(marker)
  }

  if (bounds) {
    map.fitBounds(bounds, { padding: 32, maxZoom: 15, duration: 0 })
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
  for (const m of markers) m.remove()
  markers = []
  if (map) map.remove()
  map = null
})
</script>
