<template>
  <MainLayout>
    <section class="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-6">
            <button @click="router.back()" class="flex items-center text-text-secondary hover:text-brand-600 mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </button>
            <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Tour Details</h1>
            <p class="text-text-secondary text-sm sm:text-base">Review details and nearby stays.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <Card padding="lg">
        <p class="text-center text-text-secondary py-8">Tour detail interface</p>
      </Card>

      <!-- Accommodation Suggestions -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-6">Where to Stay</h2>
        <p class="text-text-secondary mb-6">Find comfortable accommodation near this tour location</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard v-for="property in nearbyAccommodations" :key="property.id" :property="property" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'
import api from '@/services/api'

const router = useRouter()

const nearbyAccommodations = ref([])

const loadNearby = async () => {
  try {
    const res = await api.accommodations.getAll({ limit: 6 })
    nearbyAccommodations.value = Array.isArray(res?.data) ? res.data.slice(0, 6) : []
  } catch {
    nearbyAccommodations.value = []
  }
}

onMounted(() => {
  loadNearby()
})
</script>
