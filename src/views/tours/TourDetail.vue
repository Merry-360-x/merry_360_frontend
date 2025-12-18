<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <button @click="router.back()" class="flex items-center text-text-secondary hover:text-brand-600 mb-6">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back
      </button>
      <h1 class="text-3xl font-bold mb-8">Tour Details</h1>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'

const router = useRouter()

const nearbyAccommodations = ref([])
</script>
