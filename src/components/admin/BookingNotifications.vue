<template>
  <div class="booking-notifications">
    <div class="header">
      <h2>📬 Recent Bookings & Notifications</h2>
      <div class="status-badge" :class="statusClass">
        <span class="status-dot"></span>
        {{ connectionStatus }}
      </div>
    </div>

    <!-- New Booking Alert -->
    <transition name="alert">
      <div v-if="newBookingAlert" class="new-booking-alert">
        <div class="alert-content">
          <div class="alert-icon">🎉</div>
          <div class="alert-text">
            <strong>New Booking Received!</strong>
            <p>{{ newBookingAlert.property_name }} - {{ newBookingAlert.guest_name }}</p>
          </div>
          <button @click="dismissAlert" class="alert-close">&times;</button>
        </div>
      </div>
    </transition>

    <!-- Filters -->
    <div class="filters">
      <select v-model="statusFilter" class="filter-select">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button @click="refreshBookings" class="refresh-btn" :disabled="loading">
        <span v-if="loading">🔄</span>
        <span v-else>↻</span>
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && bookings.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading bookings...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="bookings.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No bookings yet</h3>
      <p>New bookings will appear here in real-time</p>
    </div>

    <!-- Bookings List -->
    <div v-else class="bookings-list">
      <transition-group name="booking" tag="div">
        <div
          v-for="booking in filteredBookings"
          :key="booking.booking_id"
          class="booking-card"
          :class="{ 'new-booking': booking.isNew }"
        >
          <div class="booking-header">
            <div class="booking-status" :class="`status-${booking.booking_status}`">
              {{ booking.booking_status }}
            </div>
            <div class="booking-time">
              {{ formatTime(booking.created_at) }}
            </div>
          </div>

          <div class="booking-body">
            <div class="property-info">
              <h3>{{ booking.property_name }}</h3>
              <p class="location">📍 {{ booking.property_location }}</p>
            </div>

            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Guest:</span>
                <span class="value">{{ booking.guest_name }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">
                  <a :href="`mailto:${booking.guest_email}`">{{ booking.guest_email }}</a>
                </span>
              </div>
              <div class="detail-row" v-if="booking.guest_phone">
                <span class="label">Phone:</span>
                <span class="value">
                  <a :href="`tel:${booking.guest_phone}`">{{ booking.guest_phone }}</a>
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span class="value">{{ formatDate(booking.start_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span class="value">{{ formatDate(booking.end_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Guests:</span>
                <span class="value">{{ booking.guests }}</span>
              </div>
              <div class="detail-row total">
                <span class="label">Total:</span>
                <span class="value">{{ formatCurrency(booking.total_price, booking.currency) }}</span>
              </div>
            </div>

            <div v-if="booking.special_requests" class="special-requests">
              <strong>Special Requests:</strong>
              <p>{{ booking.special_requests }}</p>
            </div>
          </div>

          <div class="booking-actions">
            <button @click="confirmBooking(booking)" class="btn-confirm" v-if="booking.booking_status === 'pending'">
              ✓ Confirm
            </button>
            <button @click="viewDetails(booking)" class="btn-view">
              👁 View Details
            </button>
            <button @click="contactGuest(booking)" class="btn-contact">
              ✉️ Contact Guest
            </button>
          </div>

          <!-- Notification Status -->
          <div class="notification-status" v-if="booking.notification_status">
            <span class="notification-icon" :class="`notification-${booking.notification_status}`">
              {{ booking.notification_status === 'sent' ? '✓' : booking.notification_status === 'failed' ? '✗' : '⏳' }}
            </span>
            Email {{ booking.notification_status }}
            <span v-if="booking.notification_sent_at" class="sent-time">
              - {{ formatTime(booking.notification_sent_at) }}
            </span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/services/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// State
const bookings = ref([])
const loading = ref(true)
const statusFilter = ref('all')
const connectionStatus = ref('Connecting...')
const newBookingAlert = ref(null)
let realtimeChannel = null

// Computed
const statusClass = computed(() => {
  if (connectionStatus.value === 'Live') return 'status-connected'
  if (connectionStatus.value === 'Disconnected') return 'status-disconnected'
  return 'status-connecting'
})

const filteredBookings = computed(() => {
  if (statusFilter.value === 'all') return bookings.value
  return bookings.value.filter(b => b.booking_status === statusFilter.value)
})

// Methods
async function fetchBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        status,
        total_price,
        currency,
        start_date,
        end_date,
        guests,
        booking_details,
        properties!bookings_item_id_fkey (
          name,
          location
        ),
        booking_notifications (
          status,
          sent_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    bookings.value = data.map(booking => ({
      booking_id: booking.id,
      created_at: booking.created_at,
      booking_status: booking.status,
      total_price: booking.total_price,
      currency: booking.currency,
      start_date: booking.start_date,
      end_date: booking.end_date,
      guests: booking.guests,
      property_name: booking.properties?.name || 'Unknown Property',
      property_location: booking.properties?.location || 'Unknown Location',
      guest_name: booking.booking_details?.guest_name || 'Unknown',
      guest_email: booking.booking_details?.guest_email || '',
      guest_phone: booking.booking_details?.guest_phone || '',
      special_requests: booking.booking_details?.special_requests || '',
      notification_status: booking.booking_notifications?.[0]?.status || null,
      notification_sent_at: booking.booking_notifications?.[0]?.sent_at || null,
      isNew: false
    }))

    loading.value = false
  } catch (error) {
    console.error('Error fetching bookings:', error)
    toast.error('Failed to load bookings')
    loading.value = false
  }
}

function setupRealtimeSubscription() {
  realtimeChannel = supabase
    .channel('admin-bookings')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings'
      },
      async (payload) => {
        console.log('New booking received:', payload)
        
        // Fetch full booking details with property info
        const { data: newBooking, error } = await supabase
          .from('bookings')
          .select(`
            id,
            created_at,
            status,
            total_price,
            currency,
            start_date,
            end_date,
            guests,
            booking_details,
            properties!bookings_item_id_fkey (
              name,
              location
            )
          `)
          .eq('id', payload.new.id)
          .single()

        if (error) {
          console.error('Error fetching new booking:', error)
          return
        }

        const formattedBooking = {
          booking_id: newBooking.id,
          created_at: newBooking.created_at,
          booking_status: newBooking.status,
          total_price: newBooking.total_price,
          currency: newBooking.currency,
          start_date: newBooking.start_date,
          end_date: newBooking.end_date,
          guests: newBooking.guests,
          property_name: newBooking.properties?.name || 'Unknown Property',
          property_location: newBooking.properties?.location || 'Unknown Location',
          guest_name: newBooking.booking_details?.guest_name || 'Unknown',
          guest_email: newBooking.booking_details?.guest_email || '',
          guest_phone: newBooking.booking_details?.guest_phone || '',
          special_requests: newBooking.booking_details?.special_requests || '',
          isNew: true
        }

        // Add to top of list
        bookings.value.unshift(formattedBooking)

        // Show alert
        newBookingAlert.value = formattedBooking
        
        // Play notification sound (optional)
        playNotificationSound()

        // Toast notification
        toast.success(`New booking from ${formattedBooking.guest_name}!`)

        // Remove "new" highlight after 5 seconds
        setTimeout(() => {
          const booking = bookings.value.find(b => b.booking_id === formattedBooking.booking_id)
          if (booking) booking.isNew = false
        }, 5000)
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        connectionStatus.value = 'Live'
      } else if (status === 'CLOSED') {
        connectionStatus.value = 'Disconnected'
      } else if (status === 'CHANNEL_ERROR') {
        connectionStatus.value = 'Error'
      }
    })
}

function playNotificationSound() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURA')
    audio.play()
  } catch (err) {
    // Ignore audio errors
  }
}

function dismissAlert() {
  newBookingAlert.value = null
}

function refreshBookings() {
  loading.value = true
  fetchBookings()
}

async function confirmBooking(booking) {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.booking_id)

    if (error) throw error

    booking.booking_status = 'confirmed'
    toast.success('Booking confirmed!')
  } catch (error) {
    console.error('Error confirming booking:', error)
    toast.error('Failed to confirm booking')
  }
}

function viewDetails(booking) {
  // Navigate to booking details page
  window.open(`/admin/bookings/${booking.booking_id}`, '_blank')
}

function contactGuest(booking) {
  // Open email client
  window.location.href = `mailto:${booking.guest_email}?subject=Regarding your booking at ${booking.property_name}`
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchBookings()
  setupRealtimeSubscription()
})

onUnmounted(() => {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe()
  }
})
</script>

<style scoped>
.booking-notifications {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-connected {
  background: #d4edda;
  color: #155724;
}

.status-connected .status-dot {
  background: #28a745;
}

.status-connecting {
  background: #fff3cd;
  color: #856404;
}

.status-connecting .status-dot {
  background: #ffc107;
}

.status-disconnected {
  background: #f8d7da;
  color: #721c24;
}

.status-disconnected .status-dot {
  background: #dc3545;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.new-booking-alert {
  margin-bottom: 20px;
  animation: slideDown 0.3s ease-out;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.alert-icon {
  font-size: 36px;
}

.alert-text {
  flex: 1;
}

.alert-text strong {
  display: block;
  font-size: 18px;
  margin-bottom: 5px;
}

.alert-text p {
  margin: 0;
  opacity: 0.9;
}

.alert-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.alert-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.refresh-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.bookings-list {
  display: grid;
  gap: 20px;
}

.booking-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;
}

.booking-card.new-booking {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  animation: highlightNew 0.5s ease-out;
}

@keyframes highlightNew {
  0% { transform: scale(0.98); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.booking-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.booking-time {
  color: #666;
  font-size: 14px;
}

.property-info h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.location {
  color: #666;
  font-size: 14px;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.detail-row .label {
  font-weight: 600;
  color: #666;
}

.detail-row .value {
  color: #1a1a1a;
}

.detail-row.total {
  grid-column: 1 / -1;
  padding-top: 12px;
  border-top: 2px solid #e0e0e0;
  font-size: 18px;
}

.detail-row.total .value {
  color: #667eea;
  font-weight: 700;
}

.special-requests {
  margin: 20px 0;
  padding: 15px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.special-requests strong {
  display: block;
  margin-bottom: 8px;
  color: #856404;
}

.special-requests p {
  margin: 0;
  color: #856404;
}

.booking-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.booking-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background: #28a745;
  color: white;
}

.btn-confirm:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-view {
  background: #667eea;
  color: white;
}

.btn-view:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-contact {
  background: #17a2b8;
  color: white;
}

.btn-contact:hover {
  background: #138496;
  transform: translateY(-2px);
}

.notification-status {
  margin-top: 15px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.notification-sent {
  background: #d4edda;
  color: #155724;
}

.notification-failed {
  background: #f8d7da;
  color: #721c24;
}

.notification-pending {
  background: #fff3cd;
  color: #856404;
}

.sent-time {
  margin-left: auto;
  font-style: italic;
}

/* Transitions */
.alert-enter-active, .alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.booking-enter-active {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
