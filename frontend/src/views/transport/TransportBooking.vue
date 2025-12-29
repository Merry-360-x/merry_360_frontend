<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Book Transport</h1>
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
import { ref } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'

const nearbyAccommodations = ref([])
</script>
