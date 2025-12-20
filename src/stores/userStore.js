import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useUserStore = defineStore('user', () => {
  // Load initial state from localStorage
  const savedUser = localStorage.getItem('user')
  const savedAuth = localStorage.getItem('isAuthenticated')
  
  // User data
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const isAuthenticated = ref(savedAuth === 'true')
  
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
  
  // Trip cart
  const tripCart = ref([])
  
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
    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    
    // Load loyalty points from Supabase
    if (userData.id) {
      await loadLoyaltyPoints(userData.id)
      await loadWatchlist()
      await loadBookings()
    }
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
    } catch (error) {
      console.error('Error loading loyalty points:', error)
      loyaltyPoints.value = 0
      loyaltyTier.value = 'bronze'
    }
  }
  
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    watchlist.value = []
    tripCart.value = []
    loyaltyPoints.value = 0
    loyaltyTier.value = 'bronze'
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
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
        } catch (error) {
          console.error('Error saving to wishlist:', error)
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
      } catch (error) {
        console.error('Error removing from wishlist:', error)
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
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
  }
  
  const addToCart = (item) => {
    const exists = tripCart.value.find(c => c.id === item.id && c.type === item.type)
    if (!exists) {
      tripCart.value.push({
        ...item,
        addedAt: new Date().toISOString()
      })
    }
  }
  
  const removeFromCart = (id, type) => {
    tripCart.value = tripCart.value.filter(c => !(c.id === id && c.type === type))
  }
  
  const clearCart = () => {
    tripCart.value = []
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
      } catch (error) {
        console.error('Error saving loyalty points:', error)
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
        } catch (error) {
          console.error('Error redeeming loyalty points:', error)
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
    } catch (error) {
      console.error('Error loading bookings:', error)
    }
  }
  
  return {
    // State
    user,
    isAuthenticated,
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
    nextTierPoints,
    
    // Actions
    login,
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
