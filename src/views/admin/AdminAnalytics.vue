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
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'

const metrics = ref({
  totalRevenue: 45670,
  activeUsers: 1234,
  totalBookings: 567,
  conversionRate: 18.5
})

const revenueData = ref([
  { name: 'Jul', value: 32 },
  { name: 'Aug', value: 38 },
  { name: 'Sep', value: 35 },
  { name: 'Oct', value: 42 },
  { name: 'Nov', value: 39 },
  { name: 'Dec', value: 46 }
])

const topServices = ref([
  { name: 'Masai Mara Safari', bookings: 145 },
  { name: 'Beachfront Villa', bookings: 128 },
  { name: 'Nairobi City Tour', bookings: 98 },
  { name: 'Mount Kenya Hike', bookings: 76 },
  { name: 'Airport Transfer', bookings: 65 }
])

const userActivity = ref([
  { day: 'Monday', users: 234 },
  { day: 'Tuesday', users: 289 },
  { day: 'Wednesday', users: 312 },
  { day: 'Thursday', users: 278 },
  { day: 'Friday', users: 345 },
  { day: 'Saturday', users: 412 },
  { day: 'Sunday', users: 389 }
])

const topLocations = ref([
  { city: 'Nairobi', country: 'Kenya', users: 456, percentage: 37 },
  { city: 'Mombasa', country: 'Kenya', users: 234, percentage: 19 },
  { city: 'Kisumu', country: 'Kenya', users: 178, percentage: 14 },
  { city: 'Nakuru', country: 'Kenya', users: 145, percentage: 12 },
  { city: 'Eldoret', country: 'Kenya', users: 112, percentage: 9 }
])

const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.value)))
const maxBookings = computed(() => Math.max(...topServices.value.map(s => s.bookings)))
const maxUsers = computed(() => Math.max(...userActivity.value.map(d => d.users)))
</script>
