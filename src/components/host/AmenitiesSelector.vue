<template>
  <div>
    <h3 class="text-2xl font-semibold text-text-primary mb-2">{{ title }}</h3>
    <p class="text-text-secondary mb-8">{{ subtitle }}</p>

    <!-- Guest Favorites -->
    <div v-if="showFavorites" class="mb-8">
      <h4 class="text-lg font-semibold text-text-primary mb-4">What about these guest favorites?</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          type="button"
          v-for="amenity in guestFavorites"
          :key="amenity.id"
          @click.stop.prevent="toggleAmenity(amenity.id, $event)"
          :class="[
            'flex flex-col items-start p-4 border-2 rounded-xl transition-all hover:border-gray-400',
            selected.includes(amenity.id)
              ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800'
              : 'border-gray-200 dark:border-gray-700'
          ]"
        >
          <component :is="amenity.icon" class="w-8 h-8 mb-3" />
          <span class="text-base font-medium text-text-primary">{{ amenity.label }}</span>
        </button>
      </div>
    </div>

    <!-- Standout Amenities -->
    <div>
      <h4 class="text-lg font-semibold text-text-primary mb-4">Do you have any standout amenities?</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          type="button"
          v-for="amenity in standoutAmenities"
          :key="amenity.id"
          @click.stop.prevent="toggleAmenity(amenity.id, $event)"
          :class="[
            'flex flex-col items-start p-4 border-2 rounded-xl transition-all hover:border-gray-400',
            selected.includes(amenity.id)
              ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800'
              : 'border-gray-200 dark:border-gray-700'
          ]"
        >
          <component :is="amenity.icon" class="w-8 h-8 mb-3" />
          <span class="text-base font-medium text-text-primary">{{ amenity.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Tell guests what your place has to offer'
  },
  subtitle: {
    type: String,
    default: 'You can add more amenities after you publish your listing.'
  },
  showFavorites: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selected = ref([...props.modelValue])

// Icons as inline SVG components
const WifiIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' })
])

const TVIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
])

const KitchenIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 6h18M3 12h18M9 18h6' })
])

const WasherIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '12', cy: '13', r: '6', 'stroke-width': '2' }),
  h('rect', { x: '4', y: '3', width: '16', height: '18', rx: '2', 'stroke-width': '2' }),
  h('path', { d: 'M7 6h2M11 6h2', 'stroke-width': '2', 'stroke-linecap': 'round' })
])

const ParkingIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-4-1a1 1 0 001 1h1M6 12h.01' })
])

const PaidParkingIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '12', cy: '12', r: '10', 'stroke-width': '2' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 15.25h1.5m0 0h1.5m-1.5 0v1.5m0-1.5V12a1.5 1.5 0 011.5-1.5h.75' })
])

const AirConditioningIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83' })
])

const WorkspaceIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
])

const PoolIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 21c-1.5 0-2.19-1.23-3-2-1.38-1.31-2.62-2-4-2s-2.62.69-4 2c-.81.77-1.5 2-3 2m14-8c-1.5 0-2.19-1.23-3-2-1.38-1.31-2.62-2-4-2s-2.62.69-4 2c-.81.77-1.5 2-3 2' })
])

const HotTubIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '7', cy: '7', r: '2', 'stroke-width': '2' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M2 13c0-1.1.9-2 2-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6zm18-6v2m0 4v2' })
])

const PatioIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' })
])

const BBQIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' })
])

const DiningAreaIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const FirePitIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' })
])

const guestFavorites = [
  { id: 'wifi', label: 'Wifi', icon: WifiIcon },
  { id: 'tv', label: 'TV', icon: TVIcon },
  { id: 'kitchen', label: 'Kitchen', icon: KitchenIcon },
  { id: 'washer', label: 'Washer', icon: WasherIcon },
  { id: 'free_parking', label: 'Free parking on premises', icon: ParkingIcon },
  { id: 'paid_parking', label: 'Paid parking on premises', icon: PaidParkingIcon },
  { id: 'air_conditioning', label: 'Air conditioning', icon: AirConditioningIcon },
  { id: 'workspace', label: 'Dedicated workspace', icon: WorkspaceIcon }
]

const standoutAmenities = [
  { id: 'pool', label: 'Pool', icon: PoolIcon },
  { id: 'hot_tub', label: 'Hot tub', icon: HotTubIcon },
  { id: 'patio', label: 'Patio', icon: PatioIcon },
  { id: 'bbq_grill', label: 'BBQ grill', icon: BBQIcon },
  { id: 'outdoor_dining', label: 'Outdoor dining area', icon: DiningAreaIcon },
  { id: 'fire_pit', label: 'Fire pit', icon: FirePitIcon }
]

const toggleAmenity = (id, event) => {
  // Prevent any form submission or navigation
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  const index = selected.value.indexOf(id)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(id)
  }
  emit('update:modelValue', selected.value)
}

watch(() => props.modelValue, (newVal) => {
  selected.value = [...newVal]
})
</script>
