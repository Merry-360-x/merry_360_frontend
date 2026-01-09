import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useUserStore = defineStore('user', () => {
  // User data
  // NOTE: Do not persist our own auth/user object in localStorage.
  // Supabase handles session persistence; we hydrate the profile from the database.
  const user = ref(null)
  const isAuthenticated = ref(false)

  const initialized = ref(false)
  let initPromise = null
  
  // Watchlist / Saved Items
  const watchlist = ref([])
  
  // Loyalty Points - START WITH 0 FOR NEW ACCOUNTS
  const loyaltyPoints = ref(0)
  const loyaltyTier = ref('bronze') // bronze, silver, gold, platinum
  
  // User preferences
  const preferences = ref({
    language: 'EN', // EN, RW, FR, ZH
    currency: 'RWF',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    sustainableTravel: false
  })
  
  // Bookings
  const upcomingBookings = ref([])
  const pastBookings = ref([])
  
  // Trip cart - load from localStorage on init
  const CART_STORAGE_KEY = 'merry360_tripCart'
  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        tripCart.value = Array.isArray(parsed) ? parsed : []
      }
    } catch {
      tripCart.value = []
    }
  }
  
  const saveCartToStorage = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tripCart.value))
    } catch {
      // Silent fail for storage errors
    }
  }
  
  // Initialize cart from localStorage
  const tripCart = ref([])
  loadCartFromStorage()
  
  // Subscription
  const subscription = ref({
    active: false,
    tier: null, // basic, premium, vip
    expiresAt: null
  })
  
  // Computed properties
  const watchlistCount = computed(() => watchlist.value.length)
  const cartCount = computed(() => tripCart.value.length)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isVendor = computed(() => user.value?.role === 'vendor')
  const isHost = computed(() => user.value?.role === 'host' || user.value?.role === 'vendor')
  const isStaff = computed(() => user.value?.role === 'staff')
  const canCreateListings = computed(() => ['admin', 'staff', 'host', 'vendor'].includes(user.value?.role))
  const nextTierPoints = computed(() => {
    const tiers = { bronze: 1000, silver: 5000, gold: 15000, platinum: 50000 }
    const current = loyaltyPoints.value
    const next = Object.entries(tiers).find(([tier, points]) => current < points)
    return next ? next[1] - current : 0
  })
  
  // Actions
  const login = async (userData) => {
    user.value = userData
    isAuthenticated.value = true
    
    // Load loyalty points from Supabase
    if (userData.id) {
      await loadLoyaltyPoints(userData.id)
      await loadWatchlist()
      await loadBookings()
    }
  }

  const setFromSupabaseSession = async (session) => {
    if (!session?.user) {
      logout()
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      await login({
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.user_metadata?.firstName || session.user.user_metadata?.first_name || '',
        lastName: session.user.user_metadata?.lastName || session.user.user_metadata?.last_name || '',
        role: 'user',
        verified: true
      })
      return
    }

    await login({
      id: session.user.id,
      email: session.user.email,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      phone: profile.phone || profile.phone_number || '',
      dateOfBirth: profile.date_of_birth || '',
      bio: profile.bio || '',
      studies: profile.studies || '',
      role: profile.role || 'user',
      avatar_url: profile.avatar_url || '',
      verified: true
    })
  }

  // Initialize store from Supabase session (call once on app startup).
  const initAuth = async () => {
    if (initialized.value) return
    if (initPromise) return initPromise

    initPromise = (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await setFromSupabaseSession(session)
      } finally {
        initialized.value = true
      }
    })()

    return initPromise
  }
  
  const loadLoyaltyPoints = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('loyalty_points, loyalty_tier')
        .eq('id', userId)
        .single()
      
      if (data) {
        loyaltyPoints.value = data.loyalty_points || 0
        loyaltyTier.value = data.loyalty_tier || 'bronze'
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it with 0 points
        await supabase
          .from('profiles')
          .insert([{ id: userId, loyalty_points: 0, loyalty_tier: 'bronze' }])
        loyaltyPoints.value = 0
        loyaltyTier.value = 'bronze'
      }
    } catch {
      loyaltyPoints.value = 0
      loyaltyTier.value = 'bronze'
    }
  }
  
  const logout = () => {
    // Clear local state
    // Note: Supabase signOut should be called by the component/auth service
    // which will trigger the SIGNED_OUT event in main.js that calls this function
    user.value = null
    isAuthenticated.value = false
    watchlist.value = []
    tripCart.value = []
    loyaltyPoints.value = 0
    loyaltyTier.value = 'bronze'
    initialized.value = false // Reset initialized so auth can be re-checked
    initPromise = null

    // Clear all auth-related storage
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem(CART_STORAGE_KEY)
      
      // Clear Supabase storage keys to ensure full logout
      const storageKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase')
      )
      storageKeys.forEach(key => localStorage.removeItem(key))
    } catch {
      // ignore storage errors
    }
  }
  
  const addToWatchlist = async (item) => {
    const exists = watchlist.value.find(w => w.id === item.id && w.type === item.type)
    if (!exists) {
      watchlist.value.push({
        ...item,
        savedAt: new Date().toISOString()
      })
      
      // Save to Supabase
      if (user.value?.id && item.id) {
        try {
          await supabase
            .from('wishlist')
            .upsert({ 
              user_id: user.value.id,
              listing_id: item.id,
              notes: item.notes || ''
            }, { onConflict: 'user_id,listing_id' })
        } catch {
          // Silent fail
        }
      }
    }
  }
  
  const removeFromWatchlist = async (id, type) => {
    watchlist.value = watchlist.value.filter(w => !(w.id === id && w.type === type))
    
    // Remove from Supabase
    if (user.value?.id) {
      try {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.value.id)
          .eq('listing_id', id)
      } catch {
        // Silent fail
      }
    }
  }
  
  const isInWatchlist = (id, type) => {
    return watchlist.value.some(w => w.id === id && w.type === type)
  }
  
  const loadWatchlist = async () => {
    if (!user.value?.id) return
    
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          listing:listings(*)
        `)
        .eq('user_id', user.value.id)
      
      if (error) throw error
      
      watchlist.value = data.map(item => ({
        id: item.listing_id,
        type: 'listing',
        ...item.listing,
        savedAt: item.created_at,
        notes: item.notes
      }))
    } catch {
      // Silent fail
    }
  }
  
  const addToCart = (item) => {
    const exists = tripCart.value.find(c => c.id === item.id && c.type === item.type)
    if (!exists) {
      tripCart.value.push({
        ...item,
        addedAt: new Date().toISOString()
      })
      saveCartToStorage()
    }
  }
  
  const removeFromCart = (id, type) => {
    tripCart.value = tripCart.value.filter(c => !(c.id === id && c.type === type))
    saveCartToStorage()
  }
  
  const clearCart = () => {
    tripCart.value = []
    saveCartToStorage()
  }
  
  const addLoyaltyPoints = async (points) => {
    loyaltyPoints.value += points
    updateLoyaltyTier()
    
    // Save to Supabase
    if (user.value?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            loyalty_points: loyaltyPoints.value,
            loyalty_tier: loyaltyTier.value 
          })
          .eq('id', user.value.id)
      } catch {
        // Silent fail
      }
    }
  }
  
  const redeemPoints = async (points) => {
    if (loyaltyPoints.value >= points) {
      loyaltyPoints.value -= points
      updateLoyaltyTier()
      
      // Save to Supabase
      if (user.value?.id) {
        try {
          await supabase
            .from('profiles')
            .update({ 
              loyalty_points: loyaltyPoints.value,
              loyalty_tier: loyaltyTier.value 
            })
            .eq('id', user.value.id)
        } catch {
          // Silent fail
        }
      }
      return true
    }
    return false
  }
  
  const updateLoyaltyTier = () => {
    const points = loyaltyPoints.value
    if (points >= 50000) loyaltyTier.value = 'platinum'
    else if (points >= 15000) loyaltyTier.value = 'gold'
    else if (points >= 5000) loyaltyTier.value = 'silver'
    else loyaltyTier.value = 'bronze'
  }
  
  const setLanguage = (lang) => {
    preferences.value.language = lang
  }
  
  const updateSubscription = (tier, expiresAt) => {
    subscription.value = {
      active: true,
      tier,
      expiresAt
    }
  }
  
  const loadBookings = async () => {
    if (!user.value?.id) return
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          listing:listings(*)
        `)
        .eq('user_id', user.value.id)
        .order('check_in', { ascending: false })
      
      if (error) throw error
      
      const now = new Date()
      upcomingBookings.value = data.filter(b => new Date(b.check_in) >= now)
      pastBookings.value = data.filter(b => new Date(b.check_in) < now)
    } catch {
      // Silent fail
    }
  }
  
  return {
    // State
    user,
    isAuthenticated,
    initialized,
    watchlist,
    loyaltyPoints,
    loyaltyTier,
    preferences,
    upcomingBookings,
    pastBookings,
    tripCart,
    subscription,
    
    // Computed
    watchlistCount,
    cartCount,
    isAdmin,
    isVendor,
    isHost,
    isStaff,
    canCreateListings,
    nextTierPoints,
    
    // Actions
    login,
    initAuth,
    setFromSupabaseSession,
    logout,
    loadWatchlist,
    loadBookings,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToCart,
    removeFromCart,
    clearCart,
    addLoyaltyPoints,
    redeemPoints,
    setLanguage,
    updateSubscription
  }
})
