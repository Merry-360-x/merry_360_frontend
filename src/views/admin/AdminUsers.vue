<template>
  <AdminLayout>
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
                <select 
                  v-model="user.role" 
                  @change="updateUserRole(user)"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="user">User</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="py-4 px-4">{{ formatDate(user.created_at) }}</td>
              <td class="py-4 px-4">
                <Button variant="outline" size="sm">View Profile</Button>
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

const { showToast } = useToast()
const users = ref([])
const loading = ref(true)

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

const updateUserRole = async (user) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: user.role })
      .eq('id', user.id)
    
    if (error) throw error
    
    showToast(`Updated ${user.first_name}'s role to ${user.role}`, 'success')
  } catch (err) {
    console.error('Error updating user role:', err)
    showToast('Failed to update role: ' + err.message, 'error')
  }
}

onMounted(() => {
  loadUsers()
})
</script>
