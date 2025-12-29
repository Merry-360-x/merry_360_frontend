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
              <td class="py-4 px-4">${{ tour.price }}</td>
              <td class="py-4 px-4">{{ tour.bookings }}</td>
              <td class="py-4 px-4">
                <span :class="tour.status === 'active' ? 'px-2 py-1 bg-success text-white rounded text-sm' : 'px-2 py-1 bg-gray-400 text-white rounded text-sm'">
                  {{ tour.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" @click="toggleStatus(tour)">
                    {{ tour.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </Button>
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
const tours = ref([])
const loading = ref(true)

const loadTours = async () => {
  try {
    loading.value = true
    console.log('Loading tours from Supabase...')
    
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Loaded tours:', data?.length || 0)
    tours.value = (data || []).map(t => ({
      id: t.id,
      name: t.name,
      category: t.category || 'Tour',
      location: t.destination,
      duration: `${t.duration_days} ${t.duration_days === 1 ? 'day' : 'days'}`,
      price: t.price,
      bookings: 0, // TODO: count from bookings table
      status: t.available ? 'active' : 'inactive',
      image: t.main_image || 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=100&h=100&fit=crop'
    }))
    
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
  } catch (err) {
    console.error('Error updating tour:', err)
    showToast('Failed to update tour: ' + err.message, 'error')
  }
}

onMounted(() => {
  loadTours()
})
</script>
