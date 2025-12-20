<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-gray-600">Completing sign in...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  try {
    console.log('Auth callback - checking session...')
    
    // Get the session from Supabase after OAuth redirect
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth callback error:', error)
      throw error
    }
    
    if (session?.user) {
      console.log('User authenticated:', session.user)
      
      // Ensure profile exists in database (especially for Google OAuth)
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()
        
        if (!existingProfile) {
          console.log('Creating profile for OAuth user...')
          
          // Extract first and last name from Google OAuth metadata
          const firstName = session.user.user_metadata?.given_name || 
                           session.user.user_metadata?.first_name || 
                           session.user.email?.split('@')[0] || ''
          const lastName = session.user.user_metadata?.family_name || 
                          session.user.user_metadata?.last_name || ''
          const avatarUrl = session.user.user_metadata?.picture || 
                           session.user.user_metadata?.avatar_url || ''
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
              loyalty_points: 0,
              loyalty_tier: 'bronze'
            })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
          } else {
            console.log('✅ Profile created successfully')
          }
        }
      } catch (profileCheckError) {
        console.warn('Profile check warning:', profileCheckError)
      }
      
      // Update user store with authenticated user
      userStore.login({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email,
        firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.given_name || '',
        lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.family_name || '',
        phone: session.user.phone || '',
        role: 'user',
        verified: true
      })
      
      // Store the access token
      if (session.access_token) {
        localStorage.setItem('auth_token', session.access_token)
      }
      
      // Redirect to profile or home
      router.push('/profile')
    } else {
      console.log('No session found, redirecting to login')
      router.push('/login')
    }
  } catch (error) {
    console.error('OAuth callback error:', error)
    router.push('/login?error=auth_failed')
  }
})
</script>
