<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Completing sign in...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // Get the session from the URL hash
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth callback error:', error)
      router.push('/login')
      return
    }

    if (session?.user) {
      // Log the user in
      userStore.login({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email,
        firstName: session.user.user_metadata?.first_name || '',
        lastName: session.user.user_metadata?.last_name || '',
        phone: session.user.phone || '',
        role: 'user',
        verified: true
      })

      // Store the token
      if (session.access_token) {
        localStorage.setItem('auth_token', session.access_token)
      }

      // Redirect to profile
      router.push('/profile')
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    router.push('/login')
  }
})
</script>
