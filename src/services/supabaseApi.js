/**
 * Supabase API Service
 * Complete database operations using Supabase client
 */

import { supabase } from './supabase'

// ============================================
// LISTINGS API
// ============================================

/**
 * Get all listings with filters
 */
export async function getListings(filters = {}) {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        vendor:profiles(id, first_name, last_name, avatar_url, verified)
      `)
      .eq('status', 'active')

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    
    if (filters.featured) {
      query = query.eq('featured', true)
    }
    
    if (filters.sustainable) {
      query = query.eq('sustainable', true)
    }
    
    // Sorting
    const sortBy = filters.sortBy || 'created_at'
    const ascending = filters.ascending !== false
    query = query.order(sortBy, { ascending })
    
    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) throw error
    return { data, count }
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}

/**
 * Get single listing by ID
 */
export async function getListing(id) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        vendor:profiles(id, first_name, last_name, avatar_url, verified, bio),
        reviews:reviews(
          *,
          user:profiles(id, first_name, last_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching listing:', error)
    throw error
  }
}

/**
 * Create new listing
 */
export async function createListing(listingData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('listings')
      .insert([{
        ...listingData,
        vendor_id: user.id
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating listing:', error)
    throw error
  }
}

/**
 * Update listing
 */
export async function updateListing(id, updates) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating listing:', error)
    throw error
  }
}

/**
 * Delete listing
 */
export async function deleteListing(id) {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting listing:', error)
    throw error
  }
}

/**
 * Search listings
 */
export async function searchListings(searchTerm, filters = {}) {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        vendor:profiles(id, first_name, last_name, avatar_url)
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query.limit(filters.limit || 20)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching listings:', error)
    throw error
  }
}

// ============================================
// BOOKINGS API
// ============================================

/**
 * Create booking
 */
export async function createBooking(bookingData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending'
      }])
      .select(`
        *,
        listing:listings(*)
      `)
      .single()

    if (error) throw error
    
    // Award loyalty points (10% of total price)
    const points = Math.floor(data.total_price * 0.10)
    if (points > 0) {
      await addLoyaltyTransaction(user.id, points, 'earned', `Booking ${data.id}`, data.id)
    }
    
    return data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

/**
 * Get user bookings
 */
export async function getUserBookings(userId, status = null) {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        listing:listings(
          *,
          vendor:profiles(id, first_name, last_name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('check_in', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, status, paymentStatus = null) {
  try {
    const updates = { status }
    if (paymentStatus) {
      updates.payment_status = paymentStatus
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating booking:', error)
    throw error
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId) {
  return await updateBookingStatus(bookingId, 'cancelled')
}

// ============================================
// REVIEWS API
// ============================================

/**
 * Create review
 */
export async function createReview(reviewData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        ...reviewData,
        user_id: user.id,
        verified_booking: !!reviewData.booking_id
      }])
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

/**
 * Get listing reviews
 */
export async function getListingReviews(listingId) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

// ============================================
// WISHLIST API
// ============================================

/**
 * Add to wishlist
 */
export async function addToWishlist(listingId, notes = '') {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('wishlist')
      .upsert({
        user_id: user.id,
        listing_id: listingId,
        notes
      }, { onConflict: 'user_id,listing_id' })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

/**
 * Remove from wishlist
 */
export async function removeFromWishlist(listingId) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId)

    if (error) throw error
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

/**
 * Get user wishlist
 */
export async function getUserWishlist(userId) {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        listing:listings(
          *,
          vendor:profiles(id, first_name, last_name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }
}

// ============================================
// MESSAGES API
// ============================================

/**
 * Send message
 */
export async function sendMessage(receiverId, content, listingId = null, conversationId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const messageData = {
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      conversation_id: conversationId || `${[user.id, receiverId].sort().join('_')}_${Date.now()}`
    }

    if (listingId) {
      messageData.listing_id = listingId
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        sender:sender_id(first_name, last_name, avatar_url),
        receiver:receiver_id(first_name, last_name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * Get user conversations
 */
export async function getUserConversations(userId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, first_name, last_name, avatar_url),
        receiver:profiles!receiver_id(id, first_name, last_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId, userId) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)

    if (error) throw error
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}

// ============================================
// LOYALTY API
// ============================================

/**
 * Add loyalty transaction
 */
export async function addLoyaltyTransaction(userId, points, type, description, bookingId = null) {
  try {
    // Add transaction
    const transactionData = {
      user_id: userId,
      points,
      type,
      description
    }

    if (bookingId) {
      transactionData.booking_id = bookingId
    }

    const { error: txError } = await supabase
      .from('loyalty_transactions')
      .insert([transactionData])

    if (txError) throw txError

    // Update profile points
    const { data: profile } = await supabase
      .from('profiles')
      .select('loyalty_points')
      .eq('id', userId)
      .single()

    const newPoints = (profile?.loyalty_points || 0) + points
    const newTier = calculateLoyaltyTier(newPoints)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        loyalty_points: newPoints,
        loyalty_tier: newTier
      })
      .eq('id', userId)

    if (updateError) throw updateError

    return { points: newPoints, tier: newTier }
  } catch (error) {
    console.error('Error adding loyalty transaction:', error)
    throw error
  }
}

/**
 * Calculate loyalty tier based on points
 */
function calculateLoyaltyTier(points) {
  if (points >= 50000) return 'platinum'
  if (points >= 15000) return 'gold'
  if (points >= 5000) return 'silver'
  return 'bronze'
}

/**
 * Get user loyalty transactions
 */
export async function getLoyaltyTransactions(userId) {
  try {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching loyalty transactions:', error)
    throw error
  }
}

// ============================================
// NOTIFICATIONS API
// ============================================

/**
 * Create notification
 */
export async function createNotification(userId, title, message, type, link = null) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        type,
        link
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId, unreadOnly = false) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

export default {
  // Listings
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  searchListings,
  // Bookings
  createBooking,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  // Reviews
  createReview,
  getListingReviews,
  // Wishlist
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  // Messages
  sendMessage,
  getUserConversations,
  markMessagesAsRead,
  // Loyalty
  addLoyaltyTransaction,
  getLoyaltyTransactions,
  // Notifications
  createNotification,
  getUserNotifications,
  markNotificationAsRead
}
