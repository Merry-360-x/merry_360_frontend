<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="flex">
        <!-- Admin Sidebar -->
        <aside class="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">M</span>
              </div>
              <span class="text-xl font-bold">Admin Panel</span>
            </div>
          </div>
          <nav class="p-4 space-y-1">
            <router-link 
              to="/admin" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </router-link>
            <router-link 
              to="/admin/accommodations" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/accommodations' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Accommodations
            </router-link>
            <router-link 
              to="/admin/tours" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/tours' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Tours
            </router-link>
            <router-link 
              to="/admin/transport" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/transport' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Transport
            </router-link>
            <router-link 
              to="/admin/payments" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/payments' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Payments
            </router-link>
            <router-link 
              to="/admin/users" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/users' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Users
            </router-link>
            <router-link 
              to="/admin/host-applications" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/host-applications' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Host Applications
            </router-link>
            <router-link 
              to="/admin/analytics" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/analytics' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Analytics
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8">
          <slot />
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from './MainLayout.vue'
</script>
