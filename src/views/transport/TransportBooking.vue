<template>
  <MainLayout>
    <section class="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Book Transport</h1>
            <p class="text-text-secondary text-sm sm:text-base">Choose a transport option and we’ll help you plan the rest.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <Card padding="lg">
        <p class="text-center text-text-secondary py-8">Transport booking interface</p>
      </Card>

      <!-- Accommodation Suggestions -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-6">Places to Stay</h2>
        <p class="text-text-secondary mb-6">Find accommodation at your destination</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard v-for="property in nearbyAccommodations" :key="property.id" :property="property" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'
import api from '@/services/api'

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
