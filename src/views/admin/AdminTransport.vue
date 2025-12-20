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
              <td class="py-4 px-4">${{ vehicle.ratePerDay }}</td>
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
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Remove</Button>
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
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'

const vehicles = ref([
  {
    id: 1,
    name: 'Toyota Land Cruiser',
    plateNumber: 'KCA 123A',
    driver: 'John Kamau',
    type: 'SUV',
    capacity: 7,
    ratePerDay: 150,
    status: 'available'
  },
  {
    id: 2,
    name: 'Toyota Hiace',
    plateNumber: 'KCB 456B',
    driver: 'Peter Omondi',
    type: 'Van',
    capacity: 14,
    ratePerDay: 120,
    status: 'in-use'
  },
  {
    id: 3,
    name: 'Nissan X-Trail',
    plateNumber: 'KCC 789C',
    driver: 'Mary Wanjiku',
    type: 'SUV',
    capacity: 5,
    ratePerDay: 100,
    status: 'available'
  },
  {
    id: 4,
    name: 'Mercedes Sprinter',
    plateNumber: 'KCD 321D',
    driver: 'James Mwangi',
    type: 'Van',
    capacity: 20,
    ratePerDay: 200,
    status: 'in-use'
  },
  {
    id: 5,
    name: 'Toyota Prado',
    plateNumber: 'KCE 654E',
    driver: 'Sarah Akinyi',
    type: 'SUV',
    capacity: 7,
    ratePerDay: 140,
    status: 'maintenance'
  }
])

const stats = computed(() => ({
  total: vehicles.value.length,
  available: vehicles.value.filter(v => v.status === 'available').length,
  activeBookings: vehicles.value.filter(v => v.status === 'in-use').length,
  drivers: new Set(vehicles.value.map(v => v.driver)).size
}))
</script>
