<template>
  <MainLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Vendor Sidebar -->
    <div class="flex">
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">V</span>
            </div>
            <span class="text-xl font-bold">Vendor Portal</span>
          </div>
        </div>
        <nav class="p-4 space-y-1">
          <a href="#" class="flex items-center px-4 py-3 bg-accent-blue text-white rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </a>
          <a href="#" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            My Listings
          </a>
          <a href="#" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Calendar
          </a>
          <a href="#" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Revenue
          </a>
          <a href="#" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Settings
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Vendor Dashboard</h1>
            <p class="text-text-secondary">Manage your properties and bookings</p>
          </div>
          <Button variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Listing
          </Button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Total Bookings</p>
                <p class="text-3xl font-bold">48</p>
                <p class="text-success text-sm mt-1">This month</p>
              </div>
              <div class="w-12 h-12 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Revenue</p>
                <p class="text-3xl font-bold">$12.4K</p>
                <p class="text-success text-sm mt-1">This month</p>
              </div>
              <div class="w-12 h-12 bg-accent-blue bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Avg. Rating</p>
                <p class="text-3xl font-bold">4.8</p>
                <p class="text-success text-sm mt-1">⭐ Excellent</p>
              </div>
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Properties</p>
                <p class="text-3xl font-bold">5</p>
                <p class="text-text-secondary text-sm mt-1">Active listings</p>
              </div>
              <div class="w-12 h-12 bg-warning bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <!-- My Listings -->
        <Card padding="lg">
          <h2 class="text-2xl font-bold mb-6">My Listings</h2>
          <div class="space-y-4">
            <div class="flex gap-4 p-4 border border-gray-200 rounded-button hover:border-brand-500 transition-colors">
              <img loading="lazy" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" alt="Property" class="w-32 h-24 rounded-button object-cover" />
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-semibold text-lg">Kigali Serena Hotel</h3>
                    <p class="text-text-secondary text-sm">Kigali, Rwanda</p>
                  </div>
                  <span class="px-3 py-1 bg-success bg-opacity-10 text-success text-xs font-medium rounded-full">Active</span>
                </div>
                <div class="flex items-center gap-6 text-sm">
                  <span class="text-text-secondary">48 bookings</span>
                  <span class="text-text-secondary">4.8 ⭐</span>
                  <span class="font-semibold text-brand-600">$150/night</span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="text" size="sm">View</Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
</script>
