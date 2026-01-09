<template>
  <AdminLayout>
    <!-- User Profile Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="selectedUser = null">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h2>
          <button @click="selectedUser = null" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
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
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ selectedUser.email }}</p>
              <span :class="{
                'px-3 py-1 rounded-full text-sm font-medium inline-block mt-2': true,
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': selectedUser.role === 'admin',
                'bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300': selectedUser.role === 'host',
                'bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300': selectedUser.role === 'staff',
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300': selectedUser.role === 'user'
              }">
                {{ selectedUser.role }}
              </span>
            </div>
          </div>
          
          <!-- Details -->
          <div class="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedUser.phone_number || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedUser.date_of_birth || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">City</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedUser.city || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Joined</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedUser.created_at) }}</p>
            </div>
          </div>
          
          <div v-if="selectedUser.bio" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Bio</p>
            <p class="text-gray-700 dark:text-gray-300">{{ selectedUser.bio }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">User Management</h1>
      <p class="text-text-secondary dark:text-gray-400">Manage users and assign roles</p>
    </div>

    <!-- Create Staff Account (Admin only) -->
    <Card padding="lg" class="mb-8">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Staff Account</h2>
      <p class="text-text-secondary dark:text-gray-400 text-sm mb-4">
        Staff accounts are created by admins only. Staff cannot self-register.
      </p>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="createStaff">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First name</label>
          <input v-model="staffForm.firstName" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="First" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last name</label>
          <input v-model="staffForm.lastName" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Last" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email *</label>
          <input v-model="staffForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="staff@example.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password *</label>
          <input v-model="staffForm.password" type="password" minlength="6" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Min 6 chars" />
        </div>

        <div class="md:col-span-4 flex justify-end">
          <Button type="submit" variant="primary" :loading="creatingStaff">
            Create staff
          </Button>
        </div>
      </form>
    </Card>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card padding="md">
        <p class="text-text-secondary dark:text-gray-400 text-sm mb-1">Total Users</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary dark:text-gray-400 text-sm mb-1">Admins</p>
        <p class="text-3xl font-bold text-error dark:text-red-400">{{ stats.admins }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary dark:text-gray-400 text-sm mb-1">Hosts</p>
        <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats.hosts }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary dark:text-gray-400 text-sm mb-1">Staff</p>
        <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats.staff }}</p>
      </Card>
      <Card padding="md">
        <p class="text-text-secondary dark:text-gray-400 text-sm mb-1">Regular Users</p>
        <p class="text-3xl font-bold text-success dark:text-green-400">{{ stats.users }}</p>
      </Card>
    </div>

    <!-- Users List -->
    <Card padding="lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300">User</th>
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Email</th>
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Role</th>
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Joined</th>
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <img 
                    :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.first_name" 
                    class="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ user.first_name }} {{ user.last_name }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-gray-700 dark:text-gray-300">{{ user.email }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <select 
                    v-model="user.role" 
                    @change="markUserAsChanged(user)"
                    class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="host">Host</option>
                    <option value="staff">Staff</option>
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
              <td class="py-4 px-4 text-gray-700 dark:text-gray-300">{{ formatDate(user.created_at) }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="viewProfile(user)">View Profile</Button>
                  <button 
                    @click="confirmDeleteUser(user)"
                    :disabled="user.role === 'admin'"
                    class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                  >
                    Delete
                  </button>
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

const creatingStaff = ref(false)
const staffForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter(u => u.role === 'admin').length,
  hosts: users.value.filter(u => u.role === 'host').length,
  staff: users.value.filter(u => u.role === 'staff').length,
  users: users.value.filter(u => u.role === 'user').length
}))

const createStaff = async () => {
  if (!staffForm.value.email || !staffForm.value.password) {
    showToast('Email and password are required', 'error')
    return
  }

  creatingStaff.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      showToast('You must be logged in as admin', 'error')
      return
    }

    const { data, error } = await supabase.functions.invoke('create-staff-user', {
      body: {
        email: staffForm.value.email,
        password: staffForm.value.password,
        firstName: staffForm.value.firstName,
        lastName: staffForm.value.lastName
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    if (error) throw error
    if (!data?.ok) throw new Error(data?.error || 'Failed to create staff account')

    showToast(`✅ Staff created: ${data.staffUser?.email || staffForm.value.email}`, 'success')
    staffForm.value = { firstName: '', lastName: '', email: '', password: '' }
    await loadUsers()
  } catch (err) {
    console.error('Create staff error:', err)
    showToast('Failed to create staff: ' + (err?.message || 'Unknown error'), 'error')
  } finally {
    creatingStaff.value = false
  }
}

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

const confirmDeleteUser = async (user) => {
  // Prevent deleting admins
  if (user.role === 'admin') {
    showToast('Cannot delete admin users', 'error')
    return
  }

  if (!confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`)) {
    return
  }

  try {
    console.log('🗑️ Deleting user:', user.id, user.email)
    
    // Delete from auth.users first (if we have admin access)
    // Then delete from profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (profileError) {
      console.error('❌ Error deleting profile:', profileError)
      throw profileError
    }
    
    console.log('✅ User deleted successfully')
    showToast(`User ${user.first_name} ${user.last_name} has been deleted`, 'success')
    
    // Reload users list
    await loadUsers()
  } catch (err) {
    console.error('❌ Error deleting user:', err)
    showToast('Failed to delete user: ' + (err.message || 'Unknown error'), 'error')
  }
}

onMounted(() => {
  loadUsers()
})
</script>
