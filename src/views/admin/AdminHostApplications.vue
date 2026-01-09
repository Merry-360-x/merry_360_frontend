<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Host Applications</h1>
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

    <!-- Filter Tabs -->
    <Card padding="lg">
      <div class="mb-4">
        <div class="flex gap-4 flex-wrap">
          <button 
            @click="filterStatus = 'pending'"
            :class="filterStatus === 'pending' ? 'px-4 py-2 bg-warning text-white rounded-lg font-medium' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Pending ({{ applications.filter(a => a.host_application_status === 'pending').length }})
          </button>
          <button 
            @click="filterStatus = 'approved'"
            :class="filterStatus === 'approved' ? 'px-4 py-2 bg-success text-white rounded-lg font-medium' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Approved ({{ applications.filter(a => a.host_application_status === 'approved').length }})
          </button>
          <button 
            @click="filterStatus = 'rejected'"
            :class="filterStatus === 'rejected' ? 'px-4 py-2 bg-error text-white rounded-lg font-medium' : 'px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'"
          >
            Rejected ({{ applications.filter(a => a.host_application_status === 'rejected').length }})
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-500">
        <div class="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading applications...
      </div>

      <div v-else-if="filteredApplications.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        No {{ filterStatus }} applications found
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Applicant</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Contact</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Applied On</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in filteredApplications" :key="application.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <img 
                    :src="application.avatar_url || `https://ui-avatars.com/api/?name=${application.first_name}+${application.last_name}&background=random`" 
                    class="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p class="font-semibold">{{ application.first_name }} {{ application.last_name }}</p>
                    <p class="text-xs text-gray-500">{{ getApplicantTypeLabel(application) }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="application.host_applicant_type === 'business' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'">
                  {{ application.host_applicant_type === 'business' ? 'Business' : 'Individual' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <p class="text-sm">{{ application.email }}</p>
                <p class="text-xs text-gray-500">{{ application.phone || 'No phone' }}</p>
              </td>
              <td class="py-4 px-4 text-sm">{{ formatDate(application.host_application_date || application.created_at) }}</td>
              <td class="py-4 px-4">
                <span :class="{
                  'px-3 py-1 rounded-full text-xs font-medium': true,
                  'bg-yellow-100 text-yellow-800': application.host_application_status === 'pending',
                  'bg-green-100 text-green-800': application.host_application_status === 'approved',
                  'bg-red-100 text-red-800': application.host_application_status === 'rejected'
                }">
                  {{ application.host_application_status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="viewApplication(application)">
                    View Details
                  </Button>
                  <Button 
                    v-if="application.host_application_status === 'pending'"
                    variant="primary" 
                    size="sm"
                    @click="approveApplication(application)"
                    :disabled="processingId === application.id"
                  >
                    Approve
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Application Details Modal -->
    <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="selectedApplication = null">
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Application Details</h2>
          <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Applicant Header -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <img 
              :src="selectedApplication.avatar_url || `https://ui-avatars.com/api/?name=${selectedApplication.first_name}+${selectedApplication.last_name}&background=random&size=96`" 
              class="w-20 h-20 rounded-full" 
            />
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedApplication.first_name }} {{ selectedApplication.last_name }}</h3>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedApplication.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full" :class="selectedApplication.host_applicant_type === 'business' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'">
                {{ selectedApplication.host_applicant_type === 'business' ? 'Business Applicant' : 'Individual Applicant' }}
              </span>
            </div>
          </div>
          
          <!-- Personal Information -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.first_name }} {{ selectedApplication.last_name }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.email }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.phone || 'Not provided' }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Application Date</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedApplication.host_application_date || selectedApplication.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Business Information (if business) -->
          <div v-if="selectedApplication.host_applicant_type === 'business' || selectedApplication.host_business_name">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Business Name</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.host_business_name || 'Not provided' }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax ID / TIN</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.host_business_tax_number || 'Not provided' }}</p>
              </div>
            </div>
            
            <!-- Business Certificate Preview -->
            <div v-if="selectedApplication.host_business_registration_certificate_path" class="mt-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Registration Certificate</p>
              <div class="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                <img 
                  v-if="isImageUrl(selectedApplication.host_business_registration_certificate_path)"
                  :src="selectedApplication.host_business_registration_certificate_path" 
                  class="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                  @click="openImagePreview(selectedApplication.host_business_registration_certificate_path)"
                />
                <div v-else class="flex items-center gap-3">
                  <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">PDF Document</p>
                    <a :href="selectedApplication.host_business_registration_certificate_path" target="_blank" class="text-sm text-brand-600 hover:underline">View Document</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ID Verification -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">ID Verification</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">National ID Number</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedApplication.host_id_number || 'Not provided' }}</p>
              </div>
            </div>
            
            <!-- ID Photo Preview -->
            <div v-if="selectedApplication.host_id_document_path" class="mt-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">National ID Photo</p>
              <div class="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                <img 
                  :src="selectedApplication.host_id_document_path" 
                  class="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                  @click="openImagePreview(selectedApplication.host_id_document_path)"
                />
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div v-if="selectedApplication.host_payment_method || getPaymentDetails(selectedApplication)">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                <p class="font-medium text-gray-900 dark:text-white capitalize">
                  {{ selectedApplication.host_payment_method === 'mobile_money' ? 'Mobile Money' : selectedApplication.host_payment_method === 'bank' ? 'Bank Account' : selectedApplication.host_payment_method || 'Not provided' }}
                </p>
              </div>
              <template v-if="selectedApplication.host_payment_method === 'mobile_money'">
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Provider</p>
                  <p class="font-medium text-gray-900 dark:text-white uppercase">{{ getPaymentDetails(selectedApplication)?.provider || 'Not provided' }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Mobile Number</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentDetails(selectedApplication)?.number || 'Not provided' }}</p>
                </div>
              </template>
              <template v-else-if="selectedApplication.host_payment_method === 'bank'">
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Bank Name</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentDetails(selectedApplication)?.bank_name || 'Not provided' }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Number</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentDetails(selectedApplication)?.account_number || 'Not provided' }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Holder</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentDetails(selectedApplication)?.account_name || 'Not provided' }}</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="selectedApplication.host_application_status === 'pending'" class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="primary" 
              @click="approveApplication(selectedApplication); selectedApplication = null"
              :disabled="processingId === selectedApplication.id"
              class="flex-1"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Approve as Host
            </Button>
            <Button 
              variant="outline" 
              @click="rejectApplication(selectedApplication); selectedApplication = null"
              :disabled="processingId === selectedApplication.id"
              class="flex-1"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject Application
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4" @click="previewImage = null">
      <button @click="previewImage = null" class="absolute top-4 right-4 text-white hover:text-gray-300 p-2">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <img :src="previewImage" class="max-w-full max-h-full object-contain rounded-lg" @click.stop />
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

const { success: showSuccess, error: showError } = useToast()
const applications = ref([])
const loading = ref(true)
const selectedApplication = ref(null)
const filterStatus = ref('pending')
const processingId = ref(null)
const previewImage = ref(null)

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
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getApplicantTypeLabel = (app) => {
  if (app.host_applicant_type === 'business') {
    return app.host_business_name || 'Business'
  }
  return 'Individual'
}

const isImageUrl = (url) => {
  if (!url) return false
  const lower = url.toLowerCase()
  return lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp') || lower.includes('.gif') || lower.includes('cloudinary')
}

const getPaymentDetails = (app) => {
  if (app.host_payment_details) {
    try {
      return typeof app.host_payment_details === 'string' 
        ? JSON.parse(app.host_payment_details) 
        : app.host_payment_details
    } catch {
      return null
    }
  }
  return null
}

const openImagePreview = (url) => {
  previewImage.value = url
}

const loadApplications = async () => {
  try {
    loading.value = true
    
    // First try to load from host_applications table
    let { data: appData, error: appError } = await supabase
      .from('host_applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!appError && appData && appData.length > 0) {
      // Map host_applications to expected format
      applications.value = appData.map(app => ({
        id: app.id,
        first_name: app.first_name,
        last_name: app.last_name,
        email: app.email,
        phone: app.phone,
        avatar_url: null,
        host_applicant_type: app.applicant_type,
        host_application_status: app.status,
        host_application_date: app.created_at,
        host_id_number: app.id_number,
        host_id_document_path: app.id_photo_url,
        host_business_name: app.business_name,
        host_business_tax_number: app.tax_id,
        host_business_registration_certificate_path: app.business_cert_url,
        host_payment_method: app.payment_method,
        host_payment_details: app.payment_details,
        role: app.status === 'approved' ? 'host' : 'user',
        created_at: app.created_at
      }))
    } else {
      // Fallback to profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('host_application_status', 'is', null)
        .order('host_application_date', { ascending: false, nullsFirst: false })
      
      if (error) throw error
      applications.value = data || []
    }
  } catch (error) {
    console.error('Error loading applications:', error)
    showError('Failed to load applications')
  } finally {
    loading.value = false
  }
}

const viewApplication = (application) => {
  selectedApplication.value = application
}

const approveApplication = async (application) => {
  processingId.value = application.id
  try {
    // Update in host_applications table if it exists
    const { error: appError } = await supabase
      .from('host_applications')
      .update({ status: 'approved' })
      .eq('id', application.id)
    
    // Also update profiles table
    if (application.user_id) {
      await supabase
        .from('profiles')
        .update({ 
          host_application_status: 'approved',
          role: 'host'
        })
        .eq('id', application.user_id)
    } else {
      // Find profile by email
      await supabase
        .from('profiles')
        .update({ 
          host_application_status: 'approved',
          role: 'host'
        })
        .eq('email', application.email)
    }
    
    // Update local state
    const index = applications.value.findIndex(a => a.id === application.id)
    if (index !== -1) {
      applications.value[index].host_application_status = 'approved'
      applications.value[index].role = 'host'
    }
    
    showSuccess(`${application.first_name} has been approved as a host!`)
  } catch (error) {
    console.error('Error approving application:', error)
    showError('Failed to approve application')
  } finally {
    processingId.value = null
  }
}

const rejectApplication = async (application) => {
  processingId.value = application.id
  try {
    // Update in host_applications table if it exists
    await supabase
      .from('host_applications')
      .update({ status: 'rejected' })
      .eq('id', application.id)
    
    // Also update profiles table
    if (application.user_id) {
      await supabase
        .from('profiles')
        .update({ host_application_status: 'rejected' })
        .eq('id', application.user_id)
    } else {
      await supabase
        .from('profiles')
        .update({ host_application_status: 'rejected' })
        .eq('email', application.email)
    }
    
    // Update local state
    const index = applications.value.findIndex(a => a.id === application.id)
    if (index !== -1) {
      applications.value[index].host_application_status = 'rejected'
    }
    
    showSuccess(`Application rejected`)
  } catch (error) {
    console.error('Error rejecting application:', error)
    showError('Failed to reject application')
  } finally {
    processingId.value = null
  }
}

onMounted(() => {
  loadApplications()
})
</script>
