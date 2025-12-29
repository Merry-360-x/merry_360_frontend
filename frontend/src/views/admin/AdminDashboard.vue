<template>
  <MainLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Sidebar -->
    <div class="flex">
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
          <router-link to="/admin" class="flex items-center px-4 py-3 bg-brand-500 text-white rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>
          <router-link to="/admin/accommodations" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Accommodations
          </router-link>
          <router-link to="/admin/tours" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Tours
          </router-link>
          <router-link to="/admin/transport" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            Transport
          </router-link>
          <router-link to="/admin/payments" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Payments
          </router-link>
          <router-link to="/admin/users" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Users
          </router-link>
          <router-link to="/admin/analytics" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Analytics
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p class="text-text-secondary">Platform overview and management</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Total Bookings</p>
                <p class="text-3xl font-bold">{{ stats.bookings }}</p>
                <p class="text-success text-sm mt-1">Real-time from Supabase</p>
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
                <p class="text-3xl font-bold">${{ (stats.revenue / 1000).toFixed(1) }}K</p>
                <p class="text-success text-sm mt-1">From paid bookings</p>
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
                <p class="text-text-secondary text-sm mb-1">Active Users</p>
                <p class="text-3xl font-bold">{{ stats.users }}</p>
                <p class="text-text-secondary text-sm mt-1">Registered accounts</p>
              </div>
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Properties</p>
                <p class="text-3xl font-bold">{{ stats.properties }}</p>
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

        <div class="mb-8">
          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Host Applications</p>
                <p class="text-3xl font-bold">{{ stats.pendingHostApplications }}</p>
                <p class="text-text-secondary text-sm mt-1">Pending review</p>
              </div>
              <router-link
                to="/admin/host-applications"
                class="px-4 py-2 bg-brand-500 text-white rounded-button text-sm"
              >
                View
              </router-link>
            </div>
          </Card>
        </div>

        <!-- Recent Activity -->
        <Card padding="lg">
          <h2 class="text-2xl font-bold mb-6">Recent Bookings</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 text-left">
                  <th class="pb-3 font-semibold text-text-secondary">Booking ID</th>
                  <th class="pb-3 font-semibold text-text-secondary">Customer</th>
                  <th class="pb-3 font-semibold text-text-secondary">Property</th>
                  <th class="pb-3 font-semibold text-text-secondary">Date</th>
                  <th class="pb-3 font-semibold text-text-secondary">Amount</th>
                  <th class="pb-3 font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="py-6 text-center text-text-secondary text-sm">
                    Loading bookings...
                  </td>
                </tr>
                <tr v-else-if="recentBookings.length === 0">
                  <td colspan="6" class="py-6 text-center text-text-secondary text-sm">
                    No bookings yet. New bookings will appear here as guests check out.
                  </td>
                </tr>
                <tr v-else v-for="booking in recentBookings" :key="booking.id" class="border-b border-gray-100">
                  <td class="py-4 text-sm">{{ booking.id.substring(0, 8) }}...</td>
                  <td class="py-4 text-sm">{{ booking.profiles?.first_name }} {{ booking.profiles?.last_name }}</td>
                  <td class="py-4 text-sm">{{ booking.listings?.title || 'N/A' }}</td>
                  <td class="py-4 text-sm">{{ new Date(booking.check_in).toLocaleDateString() }}</td>
                  <td class="py-4 text-sm font-semibold">${{ booking.total_price }}</td>
                  <td class="py-4">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      booking.status === 'confirmed' ? 'bg-success bg-opacity-10 text-success' : 
                      booking.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' :
                      'bg-gray-100 text-text-secondary'
                    ]">
                      {{ booking.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import { supabase } from '../../services/supabase'

const stats = ref({
  bookings: 0,
  revenue: 0,
  users: 0,
  properties: 0,
  pendingHostApplications: 0
})

const recentBookings = ref([])
const loading = ref(true)

async function loadStats() {
  try {
    // Load bookings count
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    
    // Load total revenue
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('payment_status', 'paid')
    
    const totalRevenue = bookingsData?.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0) || 0
    
    // Load users count
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    // Load properties count
    const { count: propertiesCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })

    // Load pending host applications count
    const { count: pendingHostApplicationsCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('host_application_status', 'pending')
    
    // Load recent bookings with listing details
    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (title),
        profiles (first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    stats.value = {
      bookings: bookingsCount || 0,
      revenue: totalRevenue,
      users: usersCount || 0,
      properties: propertiesCount || 0,
      pendingHostApplications: pendingHostApplicationsCount || 0
    }
    
    recentBookings.value = bookings || []
    loading.value = false
  } catch (error) {
    console.error('Error loading stats:', error)
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>
