<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">Tour Management</h1>
        <p class="text-text-secondary">Manage tour packages and experiences</p>
      </div>
      <Button variant="primary">Add New Tour</Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Tours</p>
        <p class="text-3xl font-bold">{{ stats.total }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Active Tours</p>
        <p class="text-3xl font-bold text-success">{{ stats.active }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Bookings</p>
        <p class="text-3xl font-bold text-brand-600">{{ stats.bookings }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Avg Rating</p>
        <p class="text-3xl font-bold text-warning">{{ stats.avgRating }}</p>
      </Card>
    </div>

    <!-- Tours List -->
    <Card padding="lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">Tour</th>
              <th class="text-left py-3 px-4">Location</th>
              <th class="text-left py-3 px-4">Duration</th>
              <th class="text-left py-3 px-4">Price</th>
              <th class="text-left py-3 px-4">Bookings</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in tours" :key="tour.id" class="border-b border-gray-100">
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <img :src="tour.image" class="w-16 h-16 rounded-lg object-cover mr-3" />
                  <div>
                    <p class="font-semibold">{{ tour.name }}</p>
                    <p class="text-sm text-text-secondary">{{ tour.category }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">{{ tour.location }}</td>
              <td class="py-4 px-4">{{ tour.duration }}</td>
              <td class="py-4 px-4">{{ currencyStore.formatPrice(tour.price) }}</td>
              <td class="py-4 px-4">{{ tour.bookings }}</td>
              <td class="py-4 px-4">
                <span :class="tour.status === 'active' ? 'px-2 py-1 bg-success text-white rounded text-sm' : 'px-2 py-1 bg-gray-400 text-white rounded text-sm'">
                  {{ t(tour.status === 'active' ? 'status.active' : 'status.inactive') }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="editTour(tour)">Edit</Button>
                  <Button variant="outline" size="sm" @click="toggleStatus(tour)">
                    {{ tour.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </Button>
                  <Button variant="danger" size="sm" @click="deleteTour(tour.id)">Delete</Button>
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
import { useCurrencyStore } from '@/stores/currency'
import { useTranslation } from '@/composables/useTranslation'
import { useRouter } from 'vue-router'
import { confirmDialog } from '@/composables/useConfirm'

const { showToast } = useToast()
const router = useRouter()
const { t } = useTranslation()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const tours = ref([])
const loading = ref(true)

const loadTours = async () => {
  try {
    loading.value = true
    console.log('Loading tours from Supabase...')

    // Load all tours (admin can see all, not just available ones)
    const primary = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })

    if (primary.error) {
      console.error('Error loading tours:', primary.error)
      // Don't throw, just log and continue with empty array
      tours.value = []
      loading.value = false
      return
    }

    // If tours table is empty (common after migrating from listings), fall back temporarily.
    let source = 'tours'
    let data = primary.data || []

    if (data.length === 0) {
      console.log('Tours table empty, checking listings...')
      const fallback = await supabase
        .from('listings')
        .select('*')
        .ilike('category', 'tour%')
        .order('created_at', { ascending: false })
      if (!fallback.error && (fallback.data || []).length > 0) {
        source = 'listings'
        data = fallback.data || []
        console.log('Found tours in listings table:', data.length)
      }
    }

    console.log('Loaded tours:', data?.length || 0)
    const isListingsSource = source === 'listings'
    const mapped = (data || []).map(t => {
      const isListings = isListingsSource
      return {
        id: t.id,
        name: isListings ? (t.title || 'Tour') : (t.name || 'Tour'),
        category: (t.category || t.subcategory || 'Tour'),
        location: t.destination || t.location || '—',
        duration: t.duration_days ? `${t.duration_days} ${t.duration_days === 1 ? 'day' : 'days'}` : '—',
        price: t.price ?? 0,
        bookings: 0,
        rating: t.rating ?? 0,
        status: isListings
          ? (String(t.status || '').toLowerCase() === 'active' ? 'active' : 'inactive')
          : (t.available ? 'active' : 'inactive'),
        image: t.main_image || (Array.isArray(t.images) ? t.images[0] : null) || 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=100&h=100&fit=crop'
      }
    })

    // If we are using canonical tours table, derive bookings count from bookings.tour_id
    if (!isListingsSource && mapped.length > 0) {
      const ids = mapped.map(t => t.id)
      const { data: bookingIds, error: bookingsError } = await supabase
        .from('bookings')
        .select('tour_id')
        .in('tour_id', ids)
      if (!bookingsError && bookingIds) {
        const counts = new Map()
        for (const b of bookingIds) {
          if (!b.tour_id) continue
          counts.set(b.tour_id, (counts.get(b.tour_id) || 0) + 1)
        }
        for (const t of mapped) t.bookings = counts.get(t.id) || 0
      }
    }

    tours.value = mapped
    
    if (tours.value.length === 0) {
      showToast('No tours found. Please add tours in the database.', 'warning')
    }
  } catch (err) {
    console.error('Error loading tours:', err)
    showToast('Failed to load tours: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

const stats = computed(() => ({
  total: tours.value.length,
  active: tours.value.filter(t => t.status === 'active').length,
  bookings: tours.value.reduce((sum, t) => sum + t.bookings, 0),
  avgRating: tours.value.length > 0 ? (tours.value.reduce((sum, t) => sum + (parseFloat(t.rating) || 0), 0) / tours.value.length).toFixed(1) : '0.0'
}))

const toggleStatus = async (tour) => {
  try {
    const newStatus = tour.status === 'active' ? false : true

    const { error } = await supabase
      .from('tours')
      .update({ available: newStatus })
      .eq('id', tour.id)
    
    if (error) throw error
    
    tour.status = newStatus ? 'active' : 'inactive'
    showToast(`Tour ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success')
    await loadTours()
  } catch (err) {
    console.error('Error updating tour:', err)
    showToast('Failed to update tour: ' + err.message, 'error')
  }
}

const editTour = (tour) => {
  router.push(`/vendor/create-tour?edit=${tour.id}`)
}

const deleteTour = async (id) => {
  const confirmed = await confirmDialog(
    'Are you sure you want to delete this tour? This action cannot be undone.',
    {
      title: 'Delete Tour',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  )
  
  if (!confirmed) return
  
  try {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    showToast('Tour deleted successfully', 'success')
    await loadTours()
  } catch (err) {
    console.error('Error deleting tour:', err)
    showToast('Failed to delete tour: ' + err.message, 'error')
  }
}

onMounted(() => {
  loadTours()
})
</script>
