<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">Transport Management</h1>
        <p class="text-text-secondary">Manage vehicles and drivers</p>
      </div>
      <Button variant="primary">Add New Vehicle</Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Vehicles</p>
        <p class="text-3xl font-bold">{{ stats.total }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Available</p>
        <p class="text-3xl font-bold text-success">{{ stats.available }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Active Bookings</p>
        <p class="text-3xl font-bold text-brand-600">{{ stats.activeBookings }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Drivers</p>
        <p class="text-3xl font-bold text-warning">{{ stats.drivers }}</p>
      </Card>
    </div>

    <!-- Vehicles List -->
    <Card padding="lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">Vehicle</th>
              <th class="text-left py-3 px-4">Driver</th>
              <th class="text-left py-3 px-4">Type</th>
              <th class="text-left py-3 px-4">Capacity</th>
              <th class="text-left py-3 px-4">Rate/Day</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in vehicles" :key="vehicle.id" class="border-b border-gray-100">
              <td class="py-4 px-4">
                <div>
                  <p class="font-semibold">{{ vehicle.name }}</p>
                  <p class="text-sm text-text-secondary">{{ vehicle.plateNumber }}</p>
                </div>
              </td>
              <td class="py-4 px-4">{{ vehicle.driver }}</td>
              <td class="py-4 px-4">{{ vehicle.type }}</td>
              <td class="py-4 px-4">{{ vehicle.capacity }} seats</td>
              <td class="py-4 px-4">{{ currencyStore.formatPrice(vehicle.ratePerDay) }}</td>
              <td class="py-4 px-4">
                <span :class="{
                  'px-2 py-1 bg-success text-white rounded text-sm': vehicle.status === 'available',
                  'px-2 py-1 bg-warning text-white rounded text-sm': vehicle.status === 'in-use',
                  'px-2 py-1 bg-error text-white rounded text-sm': vehicle.status === 'maintenance'
                }">
                  {{ vehicle.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="editVehicle(vehicle)">Edit</Button>
                  <Button variant="danger" size="sm" @click="deleteVehicle(vehicle.id)">Delete</Button>
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
import { useRouter } from 'vue-router'
import { confirmDialog } from '@/composables/useConfirm'

const { showToast } = useToast()
const currencyStore = useCurrencyStore()
const router = useRouter()
const vehicles = ref([])
const loading = ref(true)

const loadVehicles = async () => {
  try {
    loading.value = true
    console.log('Loading vehicles from Supabase...')

    const primary = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (primary.error) throw primary.error

    // If vehicles table is empty (common after migrating from listings), fall back temporarily.
    let source = 'vehicles'
    let data = primary.data || []

    if (data.length === 0) {
      const fallback = await supabase
        .from('listings')
        .select('*')
        .in('category', ['transport', 'vehicle', 'vehicles', 'car', 'rental'])
        .order('created_at', { ascending: false })
      if (!fallback.error && (fallback.data || []).length > 0) {
        source = 'listings'
        data = fallback.data || []
      }
    }

    console.log('Loaded vehicles:', data?.length || 0)
    const isListingsSource = source === 'listings'
    const mapped = (data || []).map(v => {
      const isListings = isListingsSource
      return {
        id: v.id,
        name: isListings ? (v.title || 'Vehicle') : (v.name || 'Vehicle'),
        plateNumber: v.license_plate || 'N/A',
        driver: v.driver_included ? 'With Driver' : 'Self Drive',
        type: v.type || v.subcategory || '—',
        capacity: v.capacity ?? '—',
        ratePerDay: v.price_per_day ?? v.price ?? 0,
        status: isListings
          ? (String(v.status || '').toLowerCase() === 'active' ? 'available' : 'in-use')
          : (v.available ? 'available' : 'in-use')
      }
    })

    // If we are using canonical vehicles table, derive in-use status from bookings.vehicle_id
    if (!isListingsSource && mapped.length > 0) {
      const ids = mapped.map(v => v.id)
      const { data: bookingIds, error: bookingsError } = await supabase
        .from('bookings')
        .select('vehicle_id')
        .in('vehicle_id', ids)
      if (!bookingsError && bookingIds) {
        const counts = new Map()
        for (const b of bookingIds) {
          if (!b.vehicle_id) continue
          counts.set(b.vehicle_id, (counts.get(b.vehicle_id) || 0) + 1)
        }
        for (const v of mapped) {
          if ((counts.get(v.id) || 0) > 0 && v.status === 'available') v.status = 'in-use'
        }
      }
    }

    vehicles.value = mapped
    
    if (vehicles.value.length === 0) {
      showToast('No vehicles found in database', 'warning')
    }
  } catch (err) {
    console.error('Error loading vehicles:', err)
    showToast('Failed to load vehicles: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

const stats = computed(() => ({
  total: vehicles.value.length,
  available: vehicles.value.filter(v => v.status === 'available').length,
  activeBookings: vehicles.value.filter(v => v.status === 'in-use').length,
  drivers: new Set(vehicles.value.map(v => v.driver)).size
}))

const editVehicle = (vehicle) => {
  router.push(`/vendor/create-transport?edit=${vehicle.id}`)
}

const deleteVehicle = async (id) => {
  const confirmed = await confirmDialog(
    'Are you sure you want to delete this vehicle? This action cannot be undone.',
    {
      title: 'Delete Vehicle',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  )
  
  if (!confirmed) return
  
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    showToast('Vehicle deleted successfully', 'success')
    await loadVehicles()
  } catch (err) {
    console.error('Error deleting vehicle:', err)
    showToast('Failed to delete vehicle: ' + err.message, 'error')
  }
}

onMounted(() => {
  loadVehicles()
})
</script>
