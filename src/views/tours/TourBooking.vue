<template>
  <MainLayout>
    <section class="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Book Tour</h1>
            <p class="text-text-secondary text-sm sm:text-base">Complete your booking details.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <Card padding="lg">
        <p class="text-center text-text-secondary py-8">Tour booking interface</p>
      </Card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
</script>
