/**
 * Supabase API Service
 * Direct database operations using Supabase client
 * This replaces the mock API with real database queries
 */

import { supabase } from './supabase'

/**
 * Accommodations API
 */
export const accommodations = {
  async getAll(params = {}) {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('available', true)

    // Apply filters
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`)
    }
    if (params.type) {
      query = query.eq('type', params.type)
    }
    if (params.minPrice) {
      // Price is stored as text, need to parse
      query = query.gte('price', params.minPrice)
    }
    if (params.maxPrice) {
      query = query.lte('price', params.maxPrice)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async search(query) {
    const searchTerm = query.q || query.query || ''
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('available', true)
      .limit(20)
    
    if (error) throw error
    return data || []
  },

  async getNearby(lat, lng, radius = 10) {
    // For now, return all properties
    // TODO: Implement geospatial queries when lat/lng columns are added
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('available', true)
      .limit(10)
    
    if (error) throw error
    return data || []
  },

  async getReviews(id) {
    // TODO: Implement reviews table
    // For now return empty array
    return []
  }
}

/**
 * Tours API
 */
export const tours = {
  async getAll(params = {}) {
    try {
      let query = supabase
        .from('tours')
        .select('*')
        .eq('available', true)

      if (params.location) {
        query = query.ilike('location', `%${params.location}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Tours table not found:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.warn('Tours query error:', error)
      return []
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Tours query error:', error)
      return null
    }
  },

  async search(query) {
    try {
      const searchTerm = query.q || query.query || ''
      
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq('available', true)
        .limit(20)
      
      if (error) {
        console.warn('Tours search error:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.warn('Tours search error:', error)
      return []
    }
  },

  async book(tourId, bookingData) {
    // Use the existing bookings table
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        item_id: tourId,
        item_type: 'tour',
        ...bookingData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

/**
 * Transport API
 */
export const transport = {
  async getRoutes(params = {}) {
    try {
      let query = supabase
        .from('transport_services')
        .select('*')
        .eq('available', true)

      if (params.route) {
        query = query.ilike('route', `%${params.route}%`)
      }

      const { data, error } = await query
      
      if (error) {
        console.warn('Transport table not found:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.warn('Transport query error:', error)
      return []
    }
  },

  async getVehicles(params = {}) {
    try {
      let query = supabase
        .from('transport_services')
        .select('*')
        .eq('available', true)

      if (params.vehicle_type) {
        query = query.eq('vehicle_type', params.vehicle_type)
      }

      const { data, error } = await query
      
      if (error) {
        console.warn('Transport table not found:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.warn('Transport query error:', error)
      return []
    }
  },

  async book(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        item_type: 'transport',
        ...bookingData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

/**
 * Bookings API
 */
export const bookings = {
  async create(bookingData) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user?.id,
        ...bookingData,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getMyBookings() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async cancel(id) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

/**
 * User Profile API
 */
export const user = {
  async getProfile() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(profileData) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', authUser.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async changePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return data
  },

  async uploadAvatar(file) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) throw new Error('Not authenticated')
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${authUser.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    // Update profile with avatar URL
    await this.updateProfile({ avatar_url: publicUrl })
    
    return publicUrl
  }
}

/**
 * Payments API
 */
export const payments = {
  async createIntent(amount, currency) {
    // This would typically call a backend function
    // For now, create a payment record in the database
    const { data, error } = await supabase
      .from('payments')
      .insert({
        amount,
        currency,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async confirm(paymentId) {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', paymentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getHistory() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

/**
 * Auth API
 */
export const auth = {
  async login(credentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    
    if (error) throw error
    return data
  },

  async signup(userData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name || userData.name,
          phone: userData.phone
        }
      }
    })
    
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
    return { message: 'Password reset email sent' }
  },

  async resetPassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return data
  }
}

/**
 * Combined API export
 */
export const supabaseApi = {
  auth,
  accommodations,
  tours,
  transport,
  bookings,
  user,
  payments
}

export default supabaseApi
