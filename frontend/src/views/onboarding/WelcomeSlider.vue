<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Slider Content -->
    <div class="flex-grow flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center animate-fade-in">
        <!-- Image/Illustration -->
        <div class="mb-8 flex justify-center">
          <div :class="slideImageClass">
            <component :is="currentSlide.icon" class="w-32 h-32 text-white" />
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-3xl font-bold text-text-brand-600 mb-4">
          {{ currentSlide.title }}
        </h2>

        <!-- Description -->
        <p class="text-text-secondary text-lg mb-8 leading-relaxed">
          {{ currentSlide.description }}
        </p>

        <!-- Dots Indicator -->
        <div class="flex justify-center space-x-2 mb-12">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="transition-all duration-300"
            :class="currentIndex === index ? 'w-8 h-2 bg-brand-500 rounded-full' : 'w-2 h-2 bg-gray-300 rounded-full'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="p-6 space-y-3">
      <Button 
        v-if="currentIndex === slides.length - 1"
        variant="primary" 
        size="lg" 
        full-width
        @click="getStarted"
      >
        Get Started
      </Button>
      <Button 
        v-else
        variant="primary" 
        size="lg" 
        full-width
        @click="nextSlide"
      >
        Next
      </Button>
      
      <button 
        @click="skip"
        class="w-full text-center text-text-secondary hover:text-brand-600 transition-colors py-3"
      >
        Skip
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../../components/common/Button.vue'

const router = useRouter()
const currentIndex = ref(0)

const slides = [
  {
    title: 'Explore Amazing Destinations',
    description: 'Discover the beauty of Rwanda and Africa with carefully curated accommodations and experiences.',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    },
    color: 'from-brand-500 to-brand-600'
  },
  {
    title: 'Book with Confidence',
    description: 'Secure bookings, verified properties, and 24/7 customer support for a worry-free travel experience.',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`
    },
    color: 'from-brand-500 to-brand-600'
  },
  {
    title: 'AI-Powered Assistance',
    description: 'Get personalized recommendations and instant support from our intelligent travel concierge.',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`
    },
    color: 'from-brand-500 to-brand-600'
  }
]

const currentSlide = computed(() => slides[currentIndex.value])
const slideImageClass = computed(() => 
  `w-48 h-48 rounded-full bg-gradient-to-br ${currentSlide.value.color} flex items-center justify-center shadow-2xl`
)

const nextSlide = () => {
  if (currentIndex.value < slides.length - 1) {
    currentIndex.value++
  }
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const skip = () => {
  router.push('/login')
}

const getStarted = () => {
  router.push('/login')
}
</script>
