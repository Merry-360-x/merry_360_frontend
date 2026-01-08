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
                  <th class="hidden md:table-cell text-left py-3 px-4">Host</th>
                  <th class="hidden md:table-cell text-left py-3 px-4">Location</th>
                  <th class="hidden md:table-cell text-left py-3 px-4">Price</th>
                  <th class="hidden md:table-cell text-left py-3 px-4">Status</th>
                  <th class="hidden md:table-cell text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in properties" :key="property.id" class="border-b border-gray-100">
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <img :src="property.image" class="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover" />
                      <div class="min-w-0">
                        <p class="font-semibold truncate">{{ property.name }}</p>
                        <p class="text-sm text-text-secondary truncate">{{ property.type }}</p>

                        <!-- Mobile details (no horizontal scrolling) -->
                        <div class="md:hidden mt-2 space-y-1 text-sm text-text-secondary">
                          <div class="flex items-center justify-between gap-3">
                            <span class="text-text-muted">Host</span>
                            <span class="font-medium text-text-primary truncate" :title="property.host">{{ shortHostLabel(property.host) }}</span>
                          </div>
                          <div class="flex items-center justify-between gap-3">
                            <span class="text-text-muted">Location</span>
                            <span class="font-medium text-text-primary truncate" :title="property.location">{{ property.location }}</span>
                          </div>
                          <div class="flex items-center justify-between gap-3">
                            <span class="text-text-muted">Price</span>
                            <span class="font-medium text-text-primary">{{ currencyStore.formatPrice(property.price) }}/{{ t('accommodation.perNight') }}</span>
                          </div>
                          <div class="flex items-center justify-between gap-3">
                            <span class="text-text-muted">Status</span>
                            <span :class="statusClass(property.status)">{{ t(property.status === 'active' ? 'status.active' : 'status.inactive') }}</span>
                          </div>

                          <div class="pt-2 flex gap-2">
                            <Button variant="outline" size="sm" full-width @click="editProperty(property)">{{ t('common.edit') }}</Button>
                            <Button variant="outline" size="sm" full-width @click="toggleStatus(property)">
                              {{ property.status === 'active' ? t('status.inactive') : t('status.active') }}
                            </Button>
                            <Button variant="danger" size="sm" full-width @click="deleteProperty(property.id)">{{ t('common.delete') }}</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="hidden md:table-cell py-4 px-4 max-w-[14rem]">
                    <span class="block truncate" :title="property.host">{{ property.host }}</span>
                  </td>
                  <td class="hidden md:table-cell py-4 px-4 max-w-[14rem]">
                    <span class="block truncate" :title="property.location">{{ property.location }}</span>
                  </td>
                  <td class="hidden md:table-cell py-4 px-4 whitespace-nowrap">{{ currencyStore.formatPrice(property.price) }}/{{ t('accommodation.perNight') }}</td>
                  <td class="hidden md:table-cell py-4 px-4">
                    <span :class="statusClass(property.status)">{{ t(property.status === 'active' ? 'status.active' : 'status.inactive') }}</span>
                  </td>
                  <td class="hidden md:table-cell py-4 px-4">
                    <div class="flex gap-2">
                      <Button variant="outline" size="sm" @click="editProperty(property)">{{ t('common.edit') }}</Button>
                      <Button variant="outline" size="sm" @click="toggleStatus(property)">
                        {{ property.status === 'active' ? t('status.inactive') : t('status.active') }}
                      </Button>
                      <Button variant="danger" size="sm" @click="deleteProperty(property.id)">{{ t('common.delete') }}</Button>
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
import { useRouter } from 'vue-router'
import { confirmDialog } from '@/composables/useConfirm'

const { showToast } = useToast()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const router = useRouter()
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

const shortHostLabel = (host) => {
  const value = String(host || '').trim()
  if (!value) return '—'
  if (value.length <= 26) return value
  return `${value.slice(0, 14)}…${value.slice(-8)}`
}

const loadProperties = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
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
    
  } catch (err) {
    showToast('Failed to load properties: ' + (err.message || 'Unknown error'), 'error')
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
    await loadProperties()
  } catch (err) {
    showToast('Failed to update property: ' + (err.message || 'Unknown error'), 'error')
  }
}

const editProperty = (property) => {
  router.push(`/admin/edit-property/${property.id}`)
}

const deleteProperty = async (id) => {
  const confirmed = await confirmDialog(
    'Are you sure you want to delete this property? This action cannot be undone.',
    {
      title: 'Delete Property',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  )
  
  if (!confirmed) return
  
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    showToast('Property deleted successfully', 'success')
    await loadProperties()
  } catch (err) {
    showToast('Failed to delete property: ' + (err.message || 'Unknown error'), 'error')
  }
}

onMounted(() => {
  loadProperties()
})
</script>
