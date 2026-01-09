<template>
  <MainLayout>
    <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <!-- Mobile top bar -->
      <div class="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary"
            @click="isSidebarOpen = true"
            :aria-label="t('common.openMenu')"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold">{{ portalInitial }}</span>
            </div>
            <span class="font-bold text-text-primary">{{ portalTitle }}</span>
          </div>

          <div class="w-10" />
        </div>
      </div>

      <div class="flex min-w-0">
        <!-- Mobile overlay -->
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 z-40 bg-black/50 md:hidden"
          @click="isSidebarOpen = false"
        />

        <!-- Staff Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transform transition-transform duration-200 md:static md:translate-x-0 md:sticky md:top-0"
          :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">{{ portalInitial }}</span>
              </div>
              <span class="text-xl font-bold text-text-primary">{{ portalTitle }}</span>
            </div>
          </div>
          <nav class="p-4 space-y-1">
            <router-link :to="dashboardPath" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors" @click="isSidebarOpen = false">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {{ t('admin.dashboard') }}
            </router-link>
            <router-link :to="propertiesPath" class="flex items-center px-4 py-3 bg-brand-500 text-white rounded-lg" @click="isSidebarOpen = false">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              {{ t('portal.myProperties') }}
            </router-link>
            <router-link :to="addPropertyPath" class="flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors" @click="isSidebarOpen = false">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              {{ t('portal.addProperty') }}
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0 p-4 md:p-8">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold mb-2 text-text-primary">{{ t('portal.myProperties') }}</h1>
              <p class="text-text-secondary">{{ t('portal.manageEditListings') }}</p>
            </div>
            <router-link 
              :to="addPropertyPath"
              class="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              {{ t('portal.addProperty') }}
            </router-link>
          </div>

          <!-- Properties List -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-text-secondary mt-4">{{ t('portal.loadingYourProperties') }}</p>
          </div>

          <div v-else-if="properties.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg class="w-20 h-20 mx-auto text-text-muted mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h2 class="text-2xl font-bold text-text-primary mb-2">{{ t('portal.noPropertiesYetTitle') }}</h2>
            <p class="text-text-secondary mb-6">{{ t('portal.startAddingPropertiesHere') }}</p>
            <router-link 
              :to="addPropertyPath"
              class="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-lg font-semibold"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              {{ t('portal.addYourFirstProperty') }}
            </router-link>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="property in properties" 
              :key="property.id"
              class="group cursor-pointer"
              @click="editProperty(property)"
            >
              <!-- Image -->
              <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
                <img 
                  :src="property.main_image || property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                  :alt="property.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <!-- Status Badge -->
                <span 
                  class="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="property.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'"
                >
                  {{ property.available ? 'Active' : 'Inactive' }}
                </span>
                <!-- Delete Button -->
                <button 
                  @click.stop="confirmDelete(property)"
                  class="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <!-- Content -->
              <div>
                <h3 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{{ property.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{{ property.location }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ property.bedrooms || 1 }} bed{{ (property.bedrooms || 1) !== 1 ? 's' : '' }} · {{ property.bathrooms || 1 }} bath{{ (property.bathrooms || 1) !== 1 ? 's' : '' }}
                </p>
                <p class="mt-1">
                  <span class="font-semibold text-sm text-gray-900 dark:text-white">{{ currencyStore.formatPrice(property.price_per_night || 0) }}</span>
                  <span class="text-xs text-gray-500"> night</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">{{ t('portal.deleteProperty') }}</h3>
        <p class="text-text-secondary mb-6">{{ t('portal.deletePropertyConfirm', { name: propertyToDelete?.name }) }}</p>
        <div class="flex gap-4">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-secondary rounded-lg transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="deleteProperty"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ deleting ? t('portal.deleting') : t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import { mapPropertyRowForPortals } from '../../services/propertyMapper'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const { error: showError } = useToast()
const loading = ref(true)
const properties = ref([])
const showDeleteModal = ref(false)
const propertyToDelete = ref(null)
const deleting = ref(false)
const isSidebarOpen = ref(false)

const isHostPortal = computed(() => String(route.path || '').startsWith('/host'))
const portalTitle = computed(() => (isHostPortal.value ? t('portal.hostPortal') : t('portal.staffPortal')))
const portalInitial = computed(() => (isHostPortal.value ? 'H' : 'S'))
const basePath = computed(() => (isHostPortal.value ? '/host' : '/staff'))
const dashboardPath = computed(() => basePath.value)
const propertiesPath = computed(() => `${basePath.value}/properties`)
const addPropertyPath = computed(() => `${basePath.value}/add-property`)

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
    properties.value = (data || []).map(mapPropertyRowForPortals)
  } catch (error) {
    console.error('Error loading properties:', error)
  } finally {
    loading.value = false
  }
}

function editProperty(property) {
  router.push(`${basePath.value}/edit-property/${property.id}`)
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
    showError(t('portal.deleteFailed'))
  } finally {
    deleting.value = false
  }
}
</script>
