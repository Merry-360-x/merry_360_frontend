<template>
  <MainLayout>
    <div class="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Host Dashboard</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Manage your listings, services, and bookings</p>
          <div class="mt-4 flex items-center gap-2">
            <span class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
              ✓ Approved Host
            </span>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ listings.length }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Active Bookings</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ activeBookings }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">RWF 0</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">4.8 ⭐</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Add Listing -->
          <div class="lg:col-span-2">
            <!-- Add New Listing -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add New Service/Listing</h2>
              
              <form @submit.prevent="handleAddListing" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Type *</label>
                    <select 
                      v-model="newListing.type"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select service type</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="tour">Tour & Experience</option>
                      <option value="transport">Transport Service</option>
                      <option value="service">Other Service</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Name *</label>
                    <input 
                      v-model="newListing.name"
                      type="text"
                      required
                      placeholder="e.g., Luxury Villa in Kigali"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea 
                    v-model="newListing.description"
                    required
                    rows="4"
                    placeholder="Describe your service in detail..."
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                    <input 
                      v-model="newListing.location"
                      type="text"
                      required
                      placeholder="e.g., Kigali, Rwanda"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price (RWF) *</label>
                    <input 
                      v-model.number="newListing.price"
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Images</label>
                  <input 
                    type="file"
                    @change="handleFileUpload"
                    multiple
                    accept="image/*"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  {{ isSubmitting ? 'Adding...' : 'Add Service/Listing' }}
                </button>
              </form>
            </div>

            <!-- My Listings -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Listings</h2>
              
              <div v-if="listings.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-gray-500 dark:text-gray-400">No listings yet. Create your first one above!</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="listing in listings" :key="listing.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium capitalize">{{ listing.type }}</span>
                        <span v-if="listing.status === 'active'" class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                        <span v-else class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>
                      </div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ listing.name }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ listing.location }}</p>
                      <p class="text-lg font-semibold text-brand-600 dark:text-brand-400 mt-2">RWF {{ listing.price.toLocaleString() }}</p>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <button 
                        @click="editListing(listing)"
                        class="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="deleteListing(listing.id)"
                        class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Quick Actions -->
          <div>
            <!-- Quick Links -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div class="space-y-2">
                <router-link 
                  to="/host-dashboard/bookings"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>View Bookings</span>
                </router-link>
                <router-link 
                  to="/host-dashboard/reviews"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>View Reviews</span>
                </router-link>
                <router-link 
                  to="/profile"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>My Profile</span>
                </router-link>
              </div>
            </div>

            <!-- Need Help -->
            <div class="bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border border-brand-200 dark:border-gray-600 rounded-xl p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Need Help?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Have questions about managing your listings or need support?</p>
              <button class="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-all text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { useUserStore } from '../../stores/userStore'
import { supabase } from '../../services/supabase'

const router = useRouter()
const userStore = useUserStore()
const isSubmitting = ref(false)
const listings = ref([])

// Check if user is an approved host
if (!userStore.isApprovedHost) {
  router.push('/become-host')
}

const newListing = reactive({
  type: '',
  name: '',
  description: '',
  location: '',
  price: 0
})

const uploadedFiles = ref([])

const activeBookings = computed(() => 5) // Placeholder

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files)
}

const handleAddListing = async () => {
  if (!newListing.type || !newListing.name || !newListing.description || !newListing.location || !newListing.price) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  
  try {
    const listingData = {
      host_id: userStore.user.id,
      type: newListing.type,
      name: newListing.name,
      description: newListing.description,
      location: newListing.location,
      price: newListing.price,
      status: 'active',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('host_listings')
      .insert([listingData])
      .select()

    if (error) throw error

    console.log('✅ Listing created:', data)
    alert('Listing added successfully!')
    
    // Reset form
    Object.keys(newListing).forEach(key => {
      if (key === 'price') {
        newListing[key] = 0
      } else {
        newListing[key] = ''
      }
    })
    uploadedFiles.value = []
    
    // Reload listings
    await loadListings()
    
  } catch (error) {
    console.error('Error creating listing:', error)
    alert('Failed to create listing. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const loadListings = async () => {
  try {
    const { data, error } = await supabase
      .from('host_listings')
      .select('*')
      .eq('host_id', userStore.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    listings.value = data || []
  } catch (error) {
    console.error('Error loading listings:', error)
  }
}

const editListing = (listing) => {
  console.log('Edit listing:', listing)
  alert('Edit functionality coming soon!')
}

const deleteListing = async (listingId) => {
  if (!confirm('Are you sure you want to delete this listing?')) return

  try {
    const { error } = await supabase
      .from('host_listings')
      .delete()
      .eq('id', listingId)

    if (error) throw error
    
    console.log('✅ Listing deleted')
    await loadListings()
  } catch (error) {
    console.error('Error deleting listing:', error)
    alert('Failed to delete listing')
  }
}

// Load listings on mount
loadListings()
</script>

<style scoped>
/* Any component-specific styles can go here */
</style>
