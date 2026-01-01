<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Hosting Applications</h1>
      <p class="text-text-secondary">Review and approve users who want to become hosts</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Pending Applications</p>
        <p class="text-3xl font-bold text-warning">{{ stats.pending }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Approved Today</p>
        <p class="text-3xl font-bold text-success">{{ stats.approvedToday }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Hosts</p>
        <p class="text-3xl font-bold text-brand-600">{{ stats.totalHosts }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Rejected</p>
        <p class="text-3xl font-bold text-error">{{ stats.rejected }}</p>
      </Card>
    </div>

    <!-- Applications List -->
    <Card padding="lg">
      <div class="mb-4">
        <div class="flex gap-4">
          <button 
            @click="filterStatus = 'pending'"
            :class="filterStatus === 'pending' ? 'px-4 py-2 bg-warning text-white rounded-lg' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Pending ({{ applications.filter(a => a.host_application_status === 'pending').length }})
          </button>
          <button 
            @click="filterStatus = 'approved'"
            :class="filterStatus === 'approved' ? 'px-4 py-2 bg-success text-white rounded-lg' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Approved ({{ applications.filter(a => a.host_application_status === 'approved').length }})
          </button>
          <button 
            @click="filterStatus = 'rejected'"
            :class="filterStatus === 'rejected' ? 'px-4 py-2 bg-error text-white rounded-lg' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Rejected ({{ applications.filter(a => a.host_application_status === 'rejected').length }})
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-500">
        Loading applications...
      </div>

      <div v-else-if="filteredApplications.length === 0" class="text-center py-8 text-gray-500">
        No {{ filterStatus }} applications found
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">Applicant</th>
              <th class="text-left py-3 px-4">Email</th>
              <th class="text-left py-3 px-4">Applied On</th>
              <th class="text-left py-3 px-4">Current Role</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in filteredApplications" :key="application.id" class="border-b border-gray-100">
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <img 
                    :src="application.avatar_url || 'https://ui-avatars.com/api/?name=' + application.first_name" 
                    class="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p class="font-semibold">{{ application.first_name }} {{ application.last_name }}</p>
                    <p class="text-sm text-gray-500">{{ application.city || 'Location not provided' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">{{ application.email }}</td>
              <td class="py-4 px-4">{{ formatDate(application.host_application_date || application.created_at) }}</td>
              <td class="py-4 px-4">
                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {{ application.role }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span :class="{
                  'px-3 py-1 rounded-full text-sm font-medium': true,
                  'bg-yellow-100 text-yellow-800': application.host_application_status === 'pending',
                  'bg-green-100 text-green-800': application.host_application_status === 'approved',
                  'bg-red-100 text-red-800': application.host_application_status === 'rejected'
                }">
                  {{ application.host_application_status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button 
                    v-if="application.host_application_status === 'pending'"
                    variant="primary" 
                    size="sm"
                    @click="approveApplication(application)"
                    :disabled="processingId === application.id"
                  >
                    {{ processingId === application.id ? 'Approving...' : 'Approve' }}
                  </Button>
                  <Button 
                    v-if="application.host_application_status === 'pending'"
                    variant="outline" 
                    size="sm"
                    @click="rejectApplication(application)"
                    :disabled="processingId === application.id"
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="viewApplication(application)"
                  >
                    View Details
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Application Details Modal -->
    <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedApplication = null">
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold">Application Details</h2>
          <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <img 
              :src="selectedApplication.avatar_url || 'https://ui-avatars.com/api/?name=' + selectedApplication.first_name" 
              class="w-24 h-24 rounded-full" 
            />
            <div>
              <h3 class="text-xl font-bold">{{ selectedApplication.first_name }} {{ selectedApplication.last_name }}</h3>
              <p class="text-gray-600">{{ selectedApplication.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ selectedApplication.phone || selectedApplication.phone_number || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">City</p>
              <p class="font-medium">{{ selectedApplication.city || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Applied On</p>
              <p class="font-medium">{{ formatDate(selectedApplication.host_application_date || selectedApplication.created_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="font-medium capitalize">{{ selectedApplication.host_application_status }}</p>
            </div>
          </div>
          
          <div v-if="selectedApplication.bio" class="border-t pt-4">
            <p class="text-sm text-gray-500 mb-2">Bio</p>
            <p class="text-gray-700">{{ selectedApplication.bio }}</p>
          </div>

          <div v-if="selectedApplication.host_application_status === 'pending'" class="border-t pt-4 flex gap-3">
            <Button 
              variant="primary" 
              @click="approveApplication(selectedApplication); selectedApplication = null"
              :disabled="processingId === selectedApplication.id"
            >
              Approve as Host
            </Button>
            <Button 
              variant="outline" 
              @click="rejectApplication(selectedApplication); selectedApplication = null"
              :disabled="processingId === selectedApplication.id"
            >
              Reject Application
            </Button>
          </div>
        </div>
      </div>
    </div>
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
const applications = ref([])
const loading = ref(true)
const selectedApplication = ref(null)
const filterStatus = ref('pending')
const processingId = ref(null)

const filteredApplications = computed(() => {
  return applications.value.filter(app => app.host_application_status === filterStatus.value)
})

const stats = computed(() => {
  const today = new Date().toDateString()
  return {
    pending: applications.value.filter(a => a.host_application_status === 'pending').length,
    approvedToday: applications.value.filter(a => {
      return a.host_application_status === 'approved' && 
             a.host_application_date && 
             new Date(a.host_application_date).toDateString() === today
    }).length,
    totalHosts: applications.value.filter(a => a.role === 'host').length,
    rejected: applications.value.filter(a => a.host_application_status === 'rejected').length
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadApplications = async () => {
  try {
    loading.value = true
    console.log('Loading host applications from Supabase...')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('host_application_status', 'is', null)
      .order('host_application_date', { ascending: false, nullsFirst: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Loaded applications:', data?.length || 0)
    applications.value = data || []
    
    if (applications.value.length === 0) {
      showToast('No hosting applications found', 'info')
    }
  } catch (err) {
    console.error('Error loading applications:', err)
    showToast('Failed to load applications: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

const approveApplication = async (application) => {
  try {
    processingId.value = application.id
    console.log('Approving application for:', application.email)
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: 'host',
        host_application_status: 'approved',
        host_approved_date: new Date().toISOString()
      })
      .eq('id', application.id)
    
    if (error) throw error
    
    // Update locally immediately
    application.role = 'host'
    application.host_application_status = 'approved'
    application.host_approved_date = new Date().toISOString()
    
    showToast(`✅ ${application.first_name} is now a HOST! Changes saved to database.`, 'success')
    
    // Reload to ensure consistency
    await loadApplications()
  } catch (err) {
    console.error('Error approving application:', err)
    showToast('Failed to approve: ' + err.message, 'error')
  } finally {
    processingId.value = null
  }
}

const rejectApplication = async (application) => {
  try {
    processingId.value = application.id
    console.log('Rejecting application for:', application.email)
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        host_application_status: 'rejected',
        host_rejected_date: new Date().toISOString()
      })
      .eq('id', application.id)
    
    if (error) throw error
    
    // Update locally immediately
    application.host_application_status = 'rejected'
    application.host_rejected_date = new Date().toISOString()
    
    showToast(`Rejected ${application.first_name}'s application. Saved to database.`, 'info')
    
    // Reload to ensure consistency
    await loadApplications()
  } catch (err) {
    console.error('Error rejecting application:', err)
    showToast('Failed to reject: ' + err.message, 'error')
  } finally {
    processingId.value = null
  }
}

const viewApplication = (application) => {
  selectedApplication.value = application
}

onMounted(() => {
  loadApplications()
})
</script>
