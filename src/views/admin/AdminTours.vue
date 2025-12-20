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
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'

const tours = ref([
  {
    id: 1,
    name: 'Nairobi City Tour',
    category: 'City Tour',
    location: 'Nairobi',
    duration: '4 hours',
    price: 50,
    bookings: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Masai Mara Safari',
    category: 'Wildlife Safari',
    location: 'Masai Mara',
    duration: '3 days',
    price: 450,
    bookings: 78,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Mount Kenya Hike',
    category: 'Adventure',
    location: 'Mount Kenya',
    duration: '2 days',
    price: 200,
    bookings: 32,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    name: 'Diani Beach Excursion',
    category: 'Beach Tour',
    location: 'Diani',
    duration: '1 day',
    price: 80,
    bookings: 56,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop'
  },
  {
    id: 5,
    name: 'Lake Nakuru Tour',
    category: 'Wildlife Safari',
    location: 'Lake Nakuru',
    duration: '1 day',
    price: 120,
    bookings: 0,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=100&h=100&fit=crop'
  }
])

const stats = computed(() => ({
  total: tours.value.length,
  active: tours.value.filter(t => t.status === 'active').length,
  bookings: tours.value.reduce((sum, t) => sum + t.bookings, 0),
  avgRating: '4.8'
}))

const toggleStatus = (tour) => {
  tour.status = tour.status === 'active' ? 'inactive' : 'active'
}
</script>
