<template>
  <AdminLayout>
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-text-primary">{{ t('adminDashboard.title') }}</h1>
      <p class="text-text-secondary">{{ t('adminDashboard.subtitle') }}</p>
    </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">{{ t('adminDashboard.stats.totalBookings') }}</p>
                <p class="text-2xl sm:text-3xl font-bold">{{ stats.bookings }}</p>
                <p class="text-success text-sm mt-1">{{ t('adminDashboard.stats.realTimeFromSupabase') }}</p>
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
                <p class="text-text-secondary text-sm mb-1">{{ t('adminDashboard.stats.revenue') }}</p>
                <p class="text-2xl sm:text-3xl font-bold">{{ currencyStore.formatPrice(stats.revenue) }}</p>
                <p class="text-success text-sm mt-1">{{ t('adminDashboard.stats.fromPaidBookings') }}</p>
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
                <p class="text-text-secondary text-sm mb-1">{{ t('adminDashboard.stats.activeUsers') }}</p>
                <p class="text-2xl sm:text-3xl font-bold">{{ stats.users }}</p>
                <p class="text-text-secondary text-sm mt-1">{{ t('adminDashboard.stats.registeredAccounts') }}</p>
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
                <p class="text-text-secondary text-sm mb-1">{{ t('adminDashboard.stats.properties') }}</p>
                <p class="text-2xl sm:text-3xl font-bold">{{ stats.properties }}</p>
                <p class="text-text-secondary text-sm mt-1">{{ t('adminDashboard.stats.activeListings') }}</p>
              </div>
              <div class="w-12 h-12 bg-warning bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </Card>
        </div>

    <div class="mb-6 sm:mb-8">
      <Card padding="md">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-text-secondary text-sm mb-1">{{ t('admin.hostApplications') }}</p>
            <p class="text-3xl font-bold text-text-primary">{{ stats.pendingHostApplications }}</p>
            <p class="text-text-secondary text-sm mt-1">{{ t('adminDashboard.pendingReview') }}</p>
          </div>
          <router-link
            to="/admin/host-applications"
            class="px-4 py-2 bg-brand-500 text-white rounded-button text-sm text-center w-full sm:w-auto"
          >
            {{ t('common.view') }}
          </router-link>
        </div>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card padding="lg">
      <h2 class="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-text-primary">{{ t('adminDashboard.recentBookings') }}</h2>
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
              <thead>
                <tr class="border-b border-gray-200 text-left">
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.bookingId') }}</th>
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.customer') }}</th>
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.property') }}</th>
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.date') }}</th>
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.amount') }}</th>
                  <th class="pb-3 font-semibold text-text-secondary text-xs sm:text-sm whitespace-nowrap">{{ t('adminDashboard.table.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="py-6 text-center text-text-secondary text-sm">
                    {{ t('adminDashboard.loadingBookings') }}
                  </td>
                </tr>
                <tr v-else-if="recentBookings.length === 0">
                  <td colspan="6" class="py-6 text-center text-text-secondary text-sm">
                    {{ t('adminDashboard.noBookingsYet') }}
                  </td>
                </tr>
                <tr v-else v-for="booking in recentBookings" :key="booking.id" class="border-b border-gray-100 dark:border-gray-700">
                  <td class="py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{{ booking.id.substring(0, 8) }}...</td>
                  <td class="py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{{ buildDisplayName(booking.profiles) }}</td>
                  <td class="py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{{ booking.listings?.title || t('common.na') }}</td>
                  <td class="py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{{ new Date(booking.check_in).toLocaleDateString() }}</td>
                  <td class="py-3 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap">{{ currencyStore.formatPrice(booking.total_price) }}</td>
                  <td class="py-4">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      booking.status === 'confirmed' ? 'bg-success bg-opacity-10 text-success' : 
                      booking.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' :
                      'bg-gray-100 text-text-secondary'
                    ]">
                      {{ formatBookingStatus(booking.status) }}
                    </span>
                  </td>
                </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import Card from '../../components/common/Card.vue'
import { supabase } from '../../services/supabase'
import { useCurrencyStore } from '@/stores/currency'
import { useTranslation } from '../../composables/useTranslation'

const currencyStore = useCurrencyStore()
const { t } = useTranslation()

const stats = ref({
  bookings: 0,
  revenue: 0,
  users: 0,
  properties: 0,
  pendingHostApplications: 0
})

const recentBookings = ref([])
const loading = ref(true)

function buildDisplayName(profile) {
  if (!profile) return t('adminDashboard.guest')
  const first = String(profile.first_name || '').trim()
  const last = String(profile.last_name || '').trim()
  const full = `${first} ${last}`.trim()
  return full || profile.email || t('adminDashboard.guest')
}

function formatBookingStatus(status) {
  const raw = String(status || '').trim().toLowerCase()
  if (!raw) return t('common.na')

  const known = ['confirmed', 'pending', 'cancelled', 'completed']
  if (known.includes(raw)) return t(`bookingStatus.${raw}`)

  return raw
}

function safeNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

async function loadStats() {
  try {
    // Load bookings count
    const { count: bookingsCount, error: bookingsCountError } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
    if (bookingsCountError) throw bookingsCountError
    
    // Load total revenue
    const { data: bookingsData, error: revenueError } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('payment_status', 'paid')
    if (revenueError) throw revenueError
    
    const totalRevenue = (bookingsData || []).reduce((sum, b) => sum + safeNumber(b.total_price), 0)
    
    // Load users count
    const { count: usersCount, error: usersCountError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
    if (usersCountError) throw usersCountError
    
    // Load listings count (used by bookings via listing_id)
    const { count: propertiesCount, error: listingsCountError } = await supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
    if (listingsCountError) throw listingsCountError

    // Load pending host applications count
    const { count: pendingHostApplicationsCount, error: pendingHostsError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('host_application_status', 'pending')
    if (pendingHostsError) throw pendingHostsError
    
    // Load recent bookings (embedded listing + profile info via FKs)
    const { data: bookingRows, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!bookings_user_id_fkey(first_name, last_name, email),
        listings!bookings_listing_id_fkey(title)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    if (bookingsError) throw bookingsError
    
    stats.value = {
      bookings: bookingsCount || 0,
      revenue: totalRevenue,
      users: usersCount || 0,
      properties: propertiesCount || 0,
      pendingHostApplications: pendingHostApplicationsCount || 0
    }
    
    recentBookings.value = bookingRows || []
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
