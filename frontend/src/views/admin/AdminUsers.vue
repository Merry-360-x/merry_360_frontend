<template>
  <AdminLayout>
    <!-- User Profile Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedUser = null">
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold">User Profile</h2>
          <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center space-x-4">
            <img 
              :src="selectedUser.avatar_url || 'https://ui-avatars.com/api/?name=' + selectedUser.first_name" 
              class="w-24 h-24 rounded-full" 
            />
            <div>
              <h3 class="text-xl font-bold">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h3>
              <p class="text-gray-600">{{ selectedUser.email }}</p>
              <span :class="{
                'px-3 py-1 rounded-full text-sm font-medium inline-block mt-2': true,
                'bg-red-100 text-red-800': selectedUser.role === 'admin',
                'bg-blue-100 text-blue-800': selectedUser.role === 'host',
                'bg-gray-100 text-gray-800': selectedUser.role === 'user'
              }">
                {{ selectedUser.role }}
              </span>
            </div>
          </div>
          
          <!-- Details -->
          <div class="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ selectedUser.phone_number || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date of Birth</p>
              <p class="font-medium">{{ selectedUser.date_of_birth || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">City</p>
              <p class="font-medium">{{ selectedUser.city || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Joined</p>
              <p class="font-medium">{{ formatDate(selectedUser.created_at) }}</p>
            </div>
          </div>
          
          <div v-if="selectedUser.bio" class="border-t pt-4">
            <p class="text-sm text-gray-500 mb-2">Bio</p>
            <p class="text-gray-700">{{ selectedUser.bio }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">User Management</h1>
      <p class="text-text-secondary">Manage users and assign roles</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Total Users</p>
        <p class="text-3xl font-bold">{{ stats.total }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Admins</p>
        <p class="text-3xl font-bold text-error">{{ stats.admins }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Hosts</p>
        <p class="text-3xl font-bold text-brand-600">{{ stats.hosts }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary text-sm mb-1">Regular Users</p>
        <p class="text-3xl font-bold text-success">{{ stats.users }}</p>
      </Card>
    </div>

    <!-- Users List -->
    <Card padding="lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4">User</th>
              <th class="text-left py-3 px-4">Email</th>
              <th class="text-left py-3 px-4">Role</th>
              <th class="text-left py-3 px-4">Joined</th>
              <th class="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-100">
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <img 
                    :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.first_name" 
                    class="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p class="font-semibold">{{ user.first_name }} {{ user.last_name }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">{{ user.email }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <select 
                    v-model="user.role" 
                    @change="markUserAsChanged(user)"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="user">User</option>
                    <option value="host">Host</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button 
                    v-if="changedUsers.has(user.id)"
                    variant="primary" 
                    size="sm"
                    @click="saveUserRole(user)"
                  >
                    Save
                  </Button>
                </div>
              </td>
              <td class="py-4 px-4">{{ formatDate(user.created_at) }}</td>
              <td class="py-4 px-4">
                <Button variant="outline" size="sm" @click="viewProfile(user)">View Profile</Button>
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
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import { supabase } from '@/services/supabase'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()
const users = ref([])
const loading = ref(true)
const selectedUser = ref(null)
const changedUsers = ref(new Set())
const originalRoles = ref(new Map())

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter(u => u.role === 'admin').length,
  hosts: users.value.filter(u => u.role === 'host').length,
  users: users.value.filter(u => u.role === 'user').length
}))

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const loadUsers = async () => {
  try {
    loading.value = true
    console.log('Loading users from Supabase...')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Loaded users:', data?.length || 0)
    users.value = data || []
    
    // Store original roles
    users.value.forEach(user => {
      originalRoles.value.set(user.id, user.role)
    })
    
    if (users.value.length === 0) {
      showToast('No users found in database', 'warning')
    }
  } catch (err) {
    console.error('Error loading users:', err)
    showToast('Failed to load users: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

const markUserAsChanged = (user) => {
  changedUsers.value.add(user.id)
}

const saveUserRole = async (user) => {
  try {
    console.log('🔄 Saving role change to database:', {
      userId: user.id,
      email: user.email,
      newRole: user.role,
      oldRole: originalRoles.value.get(user.id)
    })
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: user.role })
      .eq('id', user.id)
      .select()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    console.log('✅ Role updated successfully in database:', data)
    
    // Update original role and remove from changed
    originalRoles.value.set(user.id, user.role)
    changedUsers.value.delete(user.id)
    
    showToast(`✅ Updated ${user.first_name}'s role to ${user.role}. Saved to database!`, 'success')
    
    // Reload users from database to ensure consistency
    await loadUsers()
  } catch (err) {
    console.error('❌ Error updating user role:', err)
    showToast('Failed to update role: ' + err.message, 'error')
    // Revert to original role
    user.role = originalRoles.value.get(user.id)
    changedUsers.value.delete(user.id)
  }
}

const viewProfile = (user) => {
  selectedUser.value = user
}

onMounted(() => {
  loadUsers()
})
</script>
