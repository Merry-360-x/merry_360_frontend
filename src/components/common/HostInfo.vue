<template>
  <div v-if="host" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Host Avatar -->
    <div class="flex-shrink-0">
      <div 
        v-if="host.avatar_url" 
        class="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-brand-500 to-red-600"
      >
        <img 
          :src="host.avatar_url" 
          :alt="hostName"
          class="w-full h-full object-cover"
        />
      </div>
      <div 
        v-else
        class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-red-600 flex items-center justify-center"
      >
        <span class="text-white font-semibold text-sm">{{ hostInitials }}</span>
      </div>
    </div>

    <!-- Host Info -->
    <div class="flex-1 min-w-0">
      <p class="text-xs text-text-secondary mb-0.5">Hosted by</p>
      <p class="text-sm font-semibold text-text-primary truncate">{{ hostName }}</p>
      <div v-if="hostTitle || hostAchievement" class="flex items-center gap-2 mt-1">
        <span v-if="hostTitle" class="text-xs text-text-secondary">{{ hostTitle }}</span>
        <span v-if="hostTitle && hostAchievement" class="text-xs text-text-muted">•</span>
        <span v-if="hostAchievement" class="text-xs text-brand-600 font-medium">{{ hostAchievement }}</span>
      </div>
    </div>

    <!-- Host Badge/Icon -->
    <div class="flex-shrink-0">
      <div class="w-8 h-8 rounded-full bg-brand-500 bg-opacity-10 flex items-center justify-center">
        <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const props = defineProps({
  hostId: {
    type: String,
    required: true
  }
})

const host = ref(null)
const loading = ref(true)

const hostName = computed(() => {
  if (!host.value) return 'Host'
  const firstName = host.value.first_name || ''
  const lastName = host.value.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || host.value.email || 'Host'
})

const hostInitials = computed(() => {
  if (!host.value) return 'H'
  const firstName = host.value.first_name || ''
  const lastName = host.value.last_name || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (host.value.email) return host.value.email[0].toUpperCase()
  return 'H'
})

const hostTitle = computed(() => {
  if (!host.value) return null
  
  // Use role as title (e.g., "Superhost", "Verified Host")
  const role = host.value.role
  if (role === 'host') return 'Verified Host'
  if (role === 'staff') return 'Staff Host'
  if (role === 'admin') return 'Admin Host'
  
  // Or use bio if available (first 30 chars)
  if (host.value.bio) {
    return host.value.bio.length > 30 
      ? host.value.bio.substring(0, 30) + '...'
      : host.value.bio
  }
  
  return null
})

const hostAchievement = computed(() => {
  if (!host.value) return null
  
  // Show loyalty tier as achievement
  const tier = host.value.loyalty_tier
  if (tier && tier !== 'bronze') {
    const tierMap = {
      silver: 'Silver Host',
      gold: 'Gold Host',
      platinum: 'Platinum Host'
    }
    return tierMap[tier] || null
  }
  
  return null
})

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, avatar_url, role, bio, loyalty_tier')
      .eq('id', props.hostId)
      .single()

    if (error) throw error
    host.value = data
  } catch (error) {
    console.error('Error loading host info:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Component styles */
</style>
