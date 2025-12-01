<template>
  <PropertyLayout>
    <!-- Hero Section -->
    <section class="relative bg-gray-50 py-8 md:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-text-primary">Services</h1>
          <p class="text-sm md:text-base text-text-secondary">Everything you need for a perfect trip</p>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="service in services" :key="service.id" class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div class="p-8">
              <div 
                :class="[
                  'w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center',
                  service.bgColor
                ]"
              >
                <component :is="service.icon" :class="['w-10 h-10', service.iconColor]" />
              </div>
              <h3 class="text-lg font-bold text-text-primary mb-2 text-center">{{ service.title }}</h3>
              <p class="text-sm text-text-secondary mb-4 text-center">{{ service.description }}</p>
              <ul class="space-y-2 mb-4">
                <li v-for="feature in service.features" :key="feature" class="flex items-center text-xs text-text-secondary">
                  <svg class="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <button @click="bookService(service)" class="w-full px-5 py-2.5 bg-primary text-sm text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PropertyLayout>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import PropertyLayout from '../../components/layout/PropertyLayout.vue'

const router = useRouter()
const userStore = useUserStore()

// Icon components
const AirportIcon = () => h('svg', { 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  })
])

const GuideIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  })
])

const ConciergeIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
  })
])

const FoodIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-full h-full'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  })
])

const services = ref([
  {
    id: 1,
    title: 'Airport Transfer',
    description: 'Hassle-free pickup and drop-off',
    icon: AirportIcon,
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    features: [
      'Meet & greet at airport',
      'Professional drivers',
      'Real-time flight tracking',
      'Comfortable vehicles'
    ],
    price: 35000
  },
  {
    id: 2,
    title: 'Tour Guide Services',
    description: 'Expert local guides for your adventure',
    icon: GuideIcon,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-900',
    features: [
      'Certified guides',
      'Multiple languages',
      'Cultural insights',
      'Customized tours'
    ],
    price: 50000
  },
  {
    id: 3,
    title: '24/7 Concierge',
    description: 'Personal assistant for all your needs',
    icon: ConciergeIcon,
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    features: [
      'Restaurant bookings',
      'Event tickets',
      'Emergency support',
      'Local recommendations'
    ],
    price: 40000
  },
  {
    id: 4,
    title: 'Food & Dining',
    description: 'Restaurant reservations and food delivery',
    icon: FoodIcon,
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    features: [
      'Priority reservations',
      'Delivery service',
      'Special dietary options',
      'Local cuisine tours'
    ],
    price: 20000
  }
])

const bookService = (service) => {
  userStore.addToCart({
    ...service,
    type: 'service',
    name: service.title,
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=80'
  })
  alert(`${service.title} added to cart!`)
}
</script>
