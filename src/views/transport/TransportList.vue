<template>
  <MainLayout>
    <!-- Header Search (aligned with Home) -->
    <section class="bg-gray-50 dark:bg-gray-900 pt-6 pb-4">
      <div class="container mx-auto px-3">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 backdrop-blur rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div class="flex-1">
                <label class="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Transport</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search transport services"
                  class="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-600"
                  @keyup.enter="performSearch"
                />
              </div>
              <button
                type="button"
                @click="performSearch"
                class="w-full md:w-auto h-12 px-6 md:px-4 rounded-xl bg-brand-500 text-white flex items-center justify-center gap-2 hover:bg-brand-600 active:scale-95 transition-all shadow-lg font-medium"
                aria-label="Search transport"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="md:hidden">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Transportation Services</h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-lg">Get around Rwanda with ease</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        <Card hover clickable padding="lg" class="text-center">
          <div class="w-20 h-20 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Taxi Service</h3>
          <p class="text-text-secondary mb-4">Quick rides around the city</p>
          <Button variant="primary">Book Taxi</Button>
        </Card>

        <Card hover clickable padding="lg" class="text-center">
          <div class="w-20 h-20 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Shuttle Service</h3>
          <p class="text-text-secondary mb-4">Shared rides to popular destinations</p>
          <Button variant="primary">Book Shuttle</Button>
        </Card>

        <Card hover clickable padding="lg" class="text-center">
          <div class="w-20 h-20 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Car Rental</h3>
          <p class="text-text-secondary mb-4">Rent a vehicle for your journey</p>
          <Button variant="outline">Browse Cars</Button>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'

const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching transport for:', searchQuery.value)
  }
}
</script>
