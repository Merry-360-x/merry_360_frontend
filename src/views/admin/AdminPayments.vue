<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">Payment Management</h1>
        <p class="text-text-secondary">Track all transactions and revenue</p>
      </div>
      <Button variant="primary">Download Report</Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Revenue</p>
        <p class="text-3xl font-bold">${{ stats.totalRevenue.toLocaleString() }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Pending</p>
        <p class="text-3xl font-bold text-warning">${{ stats.pendingPayments.toLocaleString() }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Transactions</p>
        <p class="text-3xl font-bold text-brand-600">{{ stats.totalTransactions }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Failed</p>
        <p class="text-3xl font-bold text-error">{{ stats.failedPayments }}</p>
      </Card>
    </div>

    <!-- Payments List -->
    <Card padding="lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Recent Transactions</h2>
        <select class="px-4 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">Transaction ID</th>
              <th class="text-left py-3 px-4">Customer</th>
              <th class="text-left py-3 px-4">Service</th>
              <th class="text-left py-3 px-4">Amount</th>
              <th class="text-left py-3 px-4">Method</th>
              <th class="text-left py-3 px-4">Date</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id" class="border-b border-gray-100">
              <td class="py-4 px-4">
                <p class="font-mono text-sm">{{ payment.transactionId }}</p>
              </td>
              <td class="py-4 px-4">
                <div>
                  <p class="font-semibold">{{ payment.customer }}</p>
                  <p class="text-sm text-text-secondary">{{ payment.email }}</p>
                </div>
              </td>
              <td class="py-4 px-4">{{ payment.service }}</td>
              <td class="py-4 px-4 font-semibold">${{ payment.amount }}</td>
              <td class="py-4 px-4">{{ payment.paymentMethod }}</td>
              <td class="py-4 px-4">{{ payment.date }}</td>
              <td class="py-4 px-4">
                <span :class="{
                  'px-2 py-1 bg-success text-white rounded text-sm': payment.status === 'completed',
                  'px-2 py-1 bg-warning text-white rounded text-sm': payment.status === 'pending',
                  'px-2 py-1 bg-error text-white rounded text-sm': payment.status === 'failed'
                }">
                  {{ payment.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button v-if="payment.status === 'pending'" variant="outline" size="sm">Process</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import { supabase } from '@/services/supabase'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const payments = ref([])
const loading = ref(true)

// Load real payments from bookings table
const loadPayments = async () => {
  try {
    loading.value = true
    console.log('Loading payments from Supabase...')
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id(first_name, last_name, email),
        properties(name),
        tours(name),
        vehicles(name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    payments.value = (data || []).map(booking => {
      let serviceName = 'Service'
      if (booking.properties) serviceName = booking.properties.name
      else if (booking.tours) serviceName = booking.tours.name
      else if (booking.vehicles) serviceName = booking.vehicles.name
      
      const customerName = booking.profiles 
        ? `${booking.profiles.first_name} ${booking.profiles.last_name}`
        : 'Guest'
      const customerEmail = booking.profiles?.email || 'N/A'
      
      return {
        id: booking.id,
        transactionId: `TXN-${booking.id.substring(0, 8).toUpperCase()}`,
        customer: customerName,
        email: customerEmail,
        service: serviceName,
        amount: parseFloat(booking.total_price) || 0,
        paymentMethod: booking.payment_method || 'N/A',
        date: new Date(booking.created_at).toLocaleDateString(),
        status: booking.payment_status === 'paid' ? 'completed' : booking.payment_status === 'refunded' ? 'failed' : 'pending'
      }
    })
    
    console.log('Loaded payments:', payments.value.length)
    
    if (payments.value.length === 0) {
      showToast('No payments found. Payments will appear when users make bookings.', 'info')
    }
  } catch (err) {
    console.error('Error loading payments:', err)
    showToast('Failed to load payments: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPayments()
})

const stats = computed(() => ({
  totalRevenue: payments.value
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0),
  pendingPayments: payments.value
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0),
  totalTransactions: payments.value.length,
  failedPayments: payments.value.filter(p => p.status === 'failed').length
}))
</script>
