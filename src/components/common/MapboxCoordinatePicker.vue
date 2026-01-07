<template>
  <div class="space-y-3">
    <div v-if="title" class="mb-2">
      <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-text-muted">{{ subtitle }}</p>
    </div>

    <div class="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div :id="mapId" class="w-full h-[280px] bg-gray-100 dark:bg-gray-800"></div>

      <div
        v-if="!hasToken"
        class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80"
      >
        <div class="text-center px-4">
          <div class="text-sm font-semibold text-text-primary">Map unavailable</div>
          <div class="text-xs text-text-muted mt-1">Set <span class="font-mono">VITE_MAPBOX_ACCESS_TOKEN</span> to enable the map.</div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-xs text-text-muted">
        <span v-if="hasCoords">Selected: {{ formattedLat }}, {{ formattedLng }}</span>
        <span v-else>No coordinates selected yet</span>
      </div>
      <button
        type="button"
        class="text-sm text-brand-600 dark:text-brand-400 hover:underline"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: null, lng: null })
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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN || ''
const hasToken = Boolean(MAPBOX_TOKEN)

const mapId = `mapbox-coords-${Math.random().toString(16).slice(2)}`

const map = ref(null)
const marker = ref(null)

const lat = computed(() => Number(props.modelValue?.lat))
const lng = computed(() => Number(props.modelValue?.lng))
const hasCoords = computed(() => Number.isFinite(lat.value) && Number.isFinite(lng.value))

const formattedLat = computed(() => (hasCoords.value ? lat.value.toFixed(6) : ''))
const formattedLng = computed(() => (hasCoords.value ? lng.value.toFixed(6) : ''))

const defaultCenter = { lng: 30.0606, lat: -1.9536 }

const emitCoords = (nextLng, nextLat) => {
  const next = {
    lat: Number.isFinite(Number(nextLat)) ? Number(nextLat) : null,
    lng: Number.isFinite(Number(nextLng)) ? Number(nextLng) : null
  }
  emit('update:modelValue', next)
}

const ensureMarker = (center) => {
  if (!map.value) return

  if (!marker.value) {
    marker.value = new mapboxgl.Marker({ draggable: true })
      .setLngLat(center)
      .addTo(map.value)

    marker.value.on('dragend', () => {
      const ll = marker.value?.getLngLat()
      if (!ll) return
      emitCoords(ll.lng, ll.lat)
    })
  } else {
    marker.value.setLngLat(center)
  }
}

const syncFromModel = () => {
  if (!map.value || !hasToken) return

  if (hasCoords.value) {
    const center = { lng: lng.value, lat: lat.value }
    ensureMarker(center)
    map.value.setCenter(center)
  } else {
    if (marker.value) {
      marker.value.remove()
      marker.value = null
    }
  }
}

const onMapClick = (e) => {
  const ll = e?.lngLat
  if (!ll) return
  emitCoords(ll.lng, ll.lat)
}

const clear = () => {
  emit('update:modelValue', { lat: null, lng: null })
}

onMounted(() => {
  if (!hasToken) return

  mapboxgl.accessToken = MAPBOX_TOKEN

  const center = hasCoords.value ? { lng: lng.value, lat: lat.value } : defaultCenter

  map.value = new mapboxgl.Map({
    container: mapId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom: hasCoords.value ? 14 : 11
  })

  map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

  map.value.on('click', onMapClick)

  map.value.on('load', () => {
    if (hasCoords.value) ensureMarker(center)
  })
})

watch(
  () => [props.modelValue?.lat, props.modelValue?.lng],
  () => syncFromModel()
)

onBeforeUnmount(() => {
  try {
    if (marker.value) {
      marker.value.remove()
      marker.value = null
    }
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  } catch (e) {
    // no-op
  }
})
</script>
