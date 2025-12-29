<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p class="text-text-secondary">Platform performance and insights</p>
      </div>
      <select class="px-4 py-2 border border-gray-300 rounded-lg text-sm">
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>Last 90 Days</option>
        <option>This Year</option>
      </select>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Revenue</p>
        <p class="text-3xl font-bold">${{ metrics.totalRevenue.toLocaleString() }}</p>
        <p class="text-success text-sm mt-1">+12% from last month</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Active Users</p>
        <p class="text-3xl font-bold">{{ metrics.activeUsers }}</p>
        <p class="text-success text-sm mt-1">+8% from last month</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Bookings</p>
        <p class="text-3xl font-bold">{{ metrics.totalBookings }}</p>
        <p class="text-success text-sm mt-1">+15% from last month</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Conversion Rate</p>
        <p class="text-3xl font-bold">{{ metrics.conversionRate }}%</p>
        <p class="text-error text-sm mt-1">-2% from last month</p>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue Chart -->
      <Card padding="lg">
        <h2 class="text-xl font-semibold mb-1">Revenue Trend</h2>
        <p class="text-text-secondary text-sm mb-6">Monthly revenue over the last 6 months</p>
        <div class="h-64 flex items-end justify-between gap-2">
          <div v-for="month in revenueData" :key="month.name" class="flex-1 flex flex-col items-center">
            <div class="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600" 
                 :style="`height: ${(month.value / maxRevenue) * 100}%`">
            </div>
            <div class="mt-2 text-xs text-text-secondary">{{ month.name }}</div>
            <div class="text-xs font-semibold">${{ month.value }}k</div>
          </div>
        </div>
      </Card>

      <!-- Top Services -->
      <Card padding="lg">
        <h2 class="text-xl font-semibold mb-1">Top Services</h2>
        <p class="text-text-secondary text-sm mb-6">Most booked services this month</p>
        <div class="space-y-4">
          <div v-for="service in topServices" :key="service.name">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">{{ service.name }}</span>
              <span class="text-sm font-semibold">{{ service.bookings }} bookings</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-brand-500 rounded-full h-2 transition-all" 
                   :style="`width: ${(service.bookings / maxBookings) * 100}%`">
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- User Activity & Geographic Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Activity -->
      <Card padding="lg">
        <h2 class="text-xl font-semibold mb-1">User Activity</h2>
        <p class="text-text-secondary text-sm mb-6">Daily active users this week</p>
        <div class="space-y-3">
          <div v-for="day in userActivity" :key="day.day" class="flex items-center gap-4">
            <div class="w-20 text-sm text-text-secondary">{{ day.day }}</div>
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-8">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-8 flex items-center justify-end pr-3 transition-all" 
                     :style="`width: ${(day.users / maxUsers) * 100}%`">
                  <span class="text-xs font-semibold text-white">{{ day.users }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Geographic Distribution -->
      <Card padding="lg">
        <h2 class="text-xl font-semibold mb-1">Top Locations</h2>
        <p class="text-text-secondary text-sm mb-6">User distribution by city</p>
        <div class="space-y-4">
          <div v-for="location in topLocations" :key="location.city" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium">{{ location.city }}</div>
                <div class="text-xs text-text-secondary">{{ location.country }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold">{{ location.users }}</div>
              <div class="text-xs text-text-secondary">{{ location.percentage }}%</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'
import { supabase } from '@/services/supabase'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const loading = ref(true)

const metrics = ref({
  totalRevenue: 0,
  activeUsers: 0,
  totalBookings: 0,
  conversionRate: 0
})

const revenueData = ref([
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 }
])

const topServices = ref([])
const userActivity = ref([
  { day: 'Monday', users: 0 },
  { day: 'Tuesday', users: 0 },
  { day: 'Wednesday', users: 0 },
  { day: 'Thursday', users: 0 },
  { day: 'Friday', users: 0 },
  { day: 'Saturday', users: 0 },
  { day: 'Sunday', users: 0 }
])

const topLocations = ref([])

// Load real analytics data from Supabase
const loadAnalytics = async () => {
  try {
    loading.value = true
    console.log('Loading analytics from Supabase...')
    
    // Get total users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, created_at, city')
    
    if (usersError) throw usersError
    
    // Get all bookings with payment info
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, properties(name), tours(name), vehicles(name)')
    
    if (bookingsError) throw bookingsError
    
    // Calculate metrics
    metrics.value = {
      totalRevenue: (bookings || []).filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0),
      activeUsers: (users || []).length,
      totalBookings: (bookings || []).length,
      conversionRate: (bookings || []).length > 0 ? ((bookings.filter(b => b.status === 'confirmed').length / bookings.length) * 100).toFixed(1) : 0
    }
    
    // Calculate top services from bookings
    const serviceCounts = {}
    ;(bookings || []).forEach(booking => {
      let serviceName = 'Unknown'
      if (booking.properties) serviceName = booking.properties.name
      else if (booking.tours) serviceName = booking.tours.name
      else if (booking.vehicles) serviceName = booking.vehicles.name
      
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
    })
    
    topServices.value = Object.entries(serviceCounts)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5)
    
    // Calculate location distribution
    const locationCounts = {}
    const totalUsers = users?.length || 1
    ;(users || []).forEach(user => {
      const city = user.city || 'Unknown'
      locationCounts[city] = (locationCounts[city] || 0) + 1
    })
    
    topLocations.value = Object.entries(locationCounts)
      .map(([city, count]) => ({
        city,
        country: 'Kenya',
        users: count,
        percentage: Math.round((count / totalUsers) * 100)
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 5)
    
    console.log('Analytics loaded:', {
      revenue: metrics.value.totalRevenue,
      users: metrics.value.activeUsers,
      bookings: metrics.value.totalBookings
    })
    
  } catch (err) {
    console.error('Error loading analytics:', err)
    showToast('Failed to load analytics: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})

const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.value)))
const maxBookings = computed(() => Math.max(...topServices.value.map(s => s.bookings)))
const maxUsers = computed(() => Math.max(...userActivity.value.map(d => d.users)))
</script>
