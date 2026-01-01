<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="flex">
        <!-- Staff Sidebar -->
        <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0 transition-colors duration-200">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">S</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100">Staff Portal</span>
            </div>
          </div>
          <nav class="p-4 space-y-1">
            <router-link to="/staff" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </router-link>
            <router-link to="/staff/properties" class="flex items-center px-4 py-3 bg-blue-500 text-white rounded-lg">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              My Properties
            </router-link>
            <router-link to="/staff/add-property" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Property
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">My Properties</h1>
              <p class="text-gray-600 dark:text-gray-400">Manage and edit your property listings</p>
            </div>
            <router-link 
              to="/staff/add-property"
              class="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Property
            </router-link>
          </div>

          <!-- Properties List -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-gray-600 dark:text-gray-400 mt-4">Loading your properties...</p>
          </div>

          <div v-else-if="properties.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Properties Yet</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Start adding properties to manage them here</p>
            <router-link 
              to="/staff/add-property"
              class="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-lg font-semibold"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Your First Property
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="property in properties" 
              :key="property.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-colors duration-200"
            >
              <img 
                :src="property.main_image || property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                :alt="property.name"
                class="w-full md:w-64 h-48 md:h-auto object-cover"
              />
              <div class="flex-1 p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ property.name }}</h3>
                    <p class="text-gray-600 dark:text-gray-400">{{ property.location }}</p>
                  </div>
                  <span 
                    class="px-3 py-1 text-sm rounded-full"
                    :class="property.available ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'"
                  >
                    {{ property.available ? 'active' : 'inactive' }}
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ property.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ property.price_per_night }}/night</span>
                    <span class="text-gray-500 dark:text-gray-500">{{ property.bedrooms }} beds • {{ property.bathrooms }} baths</span>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      @click="editProperty(property)"
                      class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      @click="confirmDelete(property)"
                      class="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Delete Property</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete "{{ propertyToDelete?.name }}"? This action cannot be undone.</p>
        <div class="flex gap-4">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="deleteProperty"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)
const properties = ref([])
const showDeleteModal = ref(false)
const propertyToDelete = ref(null)
const deleting = ref(false)

onMounted(async () => {
  await loadProperties()
})

async function loadProperties() {
  try {
    const userId = userStore.user?.id
    if (!userId) {
      loading.value = false
      return
    }

    const { data, error } = await supabase
      .from('properties')
      .select('id,host_id,name,location,description,available,main_image,images,price_per_night,bedrooms,bathrooms,created_at')
      .eq('host_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    properties.value = data || []
  } catch (error) {
    console.error('Error loading properties:', error)
  } finally {
    loading.value = false
  }
}

function editProperty(property) {
  router.push(`/staff/edit-property/${property.id}`)
}

function confirmDelete(property) {
  propertyToDelete.value = property
  showDeleteModal.value = true
}

async function deleteProperty() {
  if (!propertyToDelete.value) return
  
  deleting.value = true
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyToDelete.value.id)

    if (error) throw error

    properties.value = properties.value.filter(p => p.id !== propertyToDelete.value.id)
    showDeleteModal.value = false
    propertyToDelete.value = null
  } catch (error) {
    console.error('Error deleting property:', error)
    alert('Failed to delete property. Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>
