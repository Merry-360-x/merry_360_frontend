<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Accommodations Management</h1>
      <p class="text-text-secondary">Manage all accommodation listings</p>
    </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="md">
            <p class="text-text-secondary text-sm mb-1">Total Properties</p>
            <p class="text-3xl font-bold">{{ stats.total }}</p>
          </Card>
          <Card padding="md">
            <p class="text-text-secondary text-sm mb-1">Active</p>
            <p class="text-3xl font-bold text-success">{{ stats.active }}</p>
          </Card>
          <Card padding="md">
            <p class="text-text-secondary text-sm mb-1">Pending</p>
            <p class="text-3xl font-bold text-warning">{{ stats.pending }}</p>
          </Card>
          <Card padding="md">
            <p class="text-text-secondary text-sm mb-1">Inactive</p>
            <p class="text-3xl font-bold text-error">{{ stats.inactive }}</p>
          </Card>
        </div>

        <!-- Properties List -->
        <Card padding="lg">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4">Property</th>
                  <th class="text-left py-3 px-4">Host</th>
                  <th class="text-left py-3 px-4">Location</th>
                  <th class="text-left py-3 px-4">Price</th>
                  <th class="text-left py-3 px-4">Status</th>
                  <th class="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in properties" :key="property.id" class="border-b border-gray-100">
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <img :src="property.image" class="w-16 h-16 rounded-lg object-cover mr-3" />
                      <div>
                        <p class="font-semibold">{{ property.name }}</p>
                        <p class="text-sm text-text-secondary">{{ property.type }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">{{ property.host }}</td>
                  <td class="py-4 px-4">{{ property.location }}</td>
                  <td class="py-4 px-4">{{ currencyStore.formatPrice(property.price) }}/{{ t('accommodation.perNight') }}</td>
                  <td class="py-4 px-4">
                    <span :class="statusClass(property.status)">{{ t(property.status === 'active' ? 'status.active' : 'status.inactive') }}</span>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex gap-2">
                      <Button variant="outline" size="sm">{{ t('common.edit') }}</Button>
                      <Button variant="outline" size="sm" @click="toggleStatus(property)">
                        {{ property.status === 'active' ? t('status.inactive') : t('status.active') }}
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
import { useCurrencyStore } from '@/stores/currency'
import { useTranslation } from '@/composables/useTranslation'
import { normalizePropertyType, getHostLabel } from '@/services/propertyMapper'

const { showToast } = useToast()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const properties = ref([])
const loading = ref(true)

const stats = computed(() => ({
  total: properties.value.length,
  active: properties.value.filter(p => p.available).length,
  pending: 0,
  inactive: properties.value.filter(p => !p.available).length
}))

const statusClass = (status) => {
  return {
    'active': 'px-2 py-1 bg-success text-white rounded text-sm',
    'pending': 'px-2 py-1 bg-warning text-white rounded text-sm',
    'inactive': 'px-2 py-1 bg-gray-400 text-white rounded text-sm'
  }[status] || 'px-2 py-1 bg-gray-400 text-white rounded text-sm'
}

const loadProperties = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    properties.value = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      type: normalizePropertyType(p.property_type || 'Property'),
      host: getHostLabel(p),
      location: p.city || p.location || 'Unknown',
      price: p.price_per_night || 0,
      status: p.available ? 'active' : 'inactive',
      image: p.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop'
    }))
    
    if (properties.value.length === 0) {
      showToast('No properties found in database', 'warning')
    }
  } catch (err) {
    console.error('Error loading properties:', err)
    showToast('Failed to load properties: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (property) => {
  try {
    const newStatus = property.status === 'active' ? false : true
    const { error } = await supabase
      .from('properties')
      .update({ available: newStatus })
      .eq('id', property.id)
    
    if (error) throw error
    
    property.status = newStatus ? 'active' : 'inactive'
    showToast(`Property ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success')
  } catch (err) {
    console.error('Error updating property:', err)
    showToast('Failed to update property: ' + err.message, 'error')
  }
}

onMounted(() => {
  loadProperties()
})
</script>
