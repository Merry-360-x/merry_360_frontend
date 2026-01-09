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
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get('code')
    const errorDescription = searchParams.get('error_description')

    if (errorDescription) {
      throw new Error(errorDescription)
    }

    // Newer Supabase OAuth uses PKCE and returns a `code` query param
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) throw exchangeError
    }
    
    // Handle hash fragment from OAuth (Supabase uses hash-based redirects)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    if (accessToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      })
      if (sessionError) throw sessionError
    }
    
    // Get the session from Supabase after OAuth redirect
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session?.user) {
      // Ensure profile exists in database (especially for Google OAuth)
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()
        
        if (!existingProfile) {
          const firstName = session.user.user_metadata?.given_name || 
                           session.user.user_metadata?.first_name || 
                           session.user.email?.split('@')[0] || ''
          const lastName = session.user.user_metadata?.family_name || 
                          session.user.user_metadata?.last_name || ''
          const avatarUrl = session.user.user_metadata?.picture || 
                           session.user.user_metadata?.avatar_url || ''
          
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            first_name: firstName,
            last_name: lastName,
            avatar_url: avatarUrl,
            loyalty_points: 10,
            loyalty_tier: 'bronze'
          })
        }
      } catch {
        // Profile check failed - continue anyway
      }
      
      // Fetch the complete profile from database
      const { data: fullProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      // Update user store with authenticated user
      await userStore.login({
        id: session.user.id,
        email: session.user.email,
        name: fullProfile ? `${fullProfile.first_name} ${fullProfile.last_name}` : session.user.email,
        firstName: fullProfile?.first_name || session.user.user_metadata?.given_name || '',
        lastName: fullProfile?.last_name || session.user.user_metadata?.family_name || '',
        phone: fullProfile?.phone || '',
        role: fullProfile?.role || 'user',
        avatarUrl: fullProfile?.avatar_url || session.user.user_metadata?.picture || '',
        verified: true
      })
      
      localStorage.setItem('auth_token', session.access_token)
      router.push('/profile')
    } else {
      router.push('/login')
    }
  } catch {
    router.push('/login?error=auth_failed')
  }
})
</script>
