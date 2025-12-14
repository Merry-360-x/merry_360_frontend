/**
 * Mock API Service
 * Simulates backend API with mock data for MVP development
 */

import {
  mockAccommodations,
  mockTours,
  mockTransportOptions,
  mockServices,
  mockUsers,
  mockBookings,
  delay,
  generateId
} from './mockData'

class MockAPI {
  constructor() {
    this.authToken = localStorage.getItem('auth_token')
    this.currentUser = null
    this.bookings = [...mockBookings]
  }

  // Authentication
  async login(credentials) {
    await delay()
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    )
    
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const token = `mock_token_${user.id}_${Date.now()}`
    localStorage.setItem('auth_token', token)
    this.authToken = token
    this.currentUser = user

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        verified: user.verified
      }
    }
  }

  async signup(userData) {
    await delay()
    
    // Check if user already exists
    const exists = mockUsers.find(u => u.email === userData.email)
    if (exists) {
      throw new Error('User already exists')
    }

    const newUser = {
      id: generateId(),
      ...userData,
      role: 'user',
      avatar: null,
      verified: false
    }

    mockUsers.push(newUser)
    
    const token = `mock_token_${newUser.id}_${Date.now()}`
    localStorage.setItem('auth_token', token)
    this.authToken = token
    this.currentUser = newUser

    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
        verified: newUser.verified
      }
    }
  }

  async logout() {
    await delay(200)
    localStorage.removeItem('auth_token')
    this.authToken = null
    this.currentUser = null
    return { success: true }
  }

  async forgotPassword(email) {
    await delay()
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('User not found')
    }
    return { success: true, message: 'Password reset email sent' }
  }

  async resetPassword(token, password) {
    await delay()
    return { success: true, message: 'Password updated successfully' }
  }

  // Accommodations
  async getAccommodations(params = {}) {
    await delay()
    let results = [...mockAccommodations]

    // Apply filters
    if (params.type) {
      results = results.filter(a => a.type === params.type)
    }
    if (params.minPrice) {
      results = results.filter(a => a.price >= params.minPrice)
    }
    if (params.maxPrice) {
      results = results.filter(a => a.price <= params.maxPrice)
    }
    if (params.minRating) {
      results = results.filter(a => a.rating >= params.minRating)
    }
    if (params.ecoFriendly) {
      results = results.filter(a => a.ecoFriendly === true)
    }
    if (params.location) {
      results = results.filter(a => 
        a.location.toLowerCase().includes(params.location.toLowerCase())
      )
    }

    // Apply search
    if (params.search) {
      const search = params.search.toLowerCase()
      results = results.filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.location.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search)
      )
    }

    // Apply sorting
    if (params.sortBy === 'price-asc') {
      results.sort((a, b) => a.price - b.price)
    } else if (params.sortBy === 'price-desc') {
      results.sort((a, b) => b.price - a.price)
    } else if (params.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating)
    }

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  async getAccommodationById(id) {
    await delay()
    const accommodation = mockAccommodations.find(a => a.id === parseInt(id))
    if (!accommodation) {
      throw new Error('Accommodation not found')
    }
    return {
      success: true,
      data: accommodation
    }
  }

  // Tours
  async getTours(params = {}) {
    await delay()
    let results = [...mockTours]

    if (params.category && params.category !== 'all') {
      results = results.filter(t => 
        t.category.toLowerCase() === params.category.toLowerCase()
      )
    }
    if (params.maxPrice) {
      results = results.filter(t => t.price <= params.maxPrice)
    }
    if (params.search) {
      const search = params.search.toLowerCase()
      results = results.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      )
    }

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  async getTourById(id) {
    await delay()
    const tour = mockTours.find(t => t.id === parseInt(id))
    if (!tour) {
      throw new Error('Tour not found')
    }
    return {
      success: true,
      data: tour
    }
  }

  // Transport
  async getTransportOptions(params = {}) {
    await delay()
    let results = [...mockTransportOptions]

    if (params.type) {
      results = results.filter(t => t.type === params.type)
    }
    if (params.maxPrice) {
      results = results.filter(t => t.price <= params.maxPrice)
    }

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  // Services
  async getServices(params = {}) {
    await delay()
    let results = [...mockServices]

    if (params.category) {
      results = results.filter(s => s.category === params.category)
    }

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  // Bookings
  async createBooking(bookingData) {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    const newBooking = {
      id: generateId(),
      ...bookingData,
      userId: this.currentUser?.id || 1,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      bookingNumber: `BK${Date.now().toString().slice(-8)}`
    }

    this.bookings.push(newBooking)

    return {
      success: true,
      data: newBooking,
      message: 'Booking created successfully'
    }
  }

  async getMyBookings() {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    const userBookings = this.bookings.filter(b => 
      b.userId === this.currentUser?.id
    )

    return {
      success: true,
      data: userBookings,
      total: userBookings.length
    }
  }

  async getBookingById(id) {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    const booking = this.bookings.find(b => b.id === id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    return {
      success: true,
      data: booking
    }
  }

  async cancelBooking(id) {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    const bookingIndex = this.bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    this.bookings[bookingIndex].status = 'cancelled'

    return {
      success: true,
      message: 'Booking cancelled successfully'
    }
  }

  // User Profile
  async getProfile() {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    return {
      success: true,
      data: this.currentUser
    }
  }

  async updateProfile(data) {
    await delay()
    
    if (!this.authToken) {
      throw new Error('Authentication required')
    }

    this.currentUser = { ...this.currentUser, ...data }

    return {
      success: true,
      data: this.currentUser,
      message: 'Profile updated successfully'
    }
  }

  // Payments
  async createPaymentIntent(amount, currency) {
    await delay()
    
    return {
      success: true,
      data: {
        intentId: `pi_${generateId()}`,
        amount,
        currency,
        status: 'requires_confirmation'
      }
    }
  }

  async confirmPayment(intentId) {
    await delay(1000) // Simulate payment processing
    
    return {
      success: true,
      data: {
        intentId,
        status: 'succeeded'
      },
      message: 'Payment successful'
    }
  }

  // Search
  async search(query) {
    await delay()
    
    const searchLower = query.toLowerCase()
    
    const accommodationResults = mockAccommodations.filter(a =>
      a.name.toLowerCase().includes(searchLower) ||
      a.location.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower)
    )

    const tourResults = mockTours.filter(t =>
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    )

    const transportResults = mockTransportOptions.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    )

    return {
      success: true,
      data: {
        accommodations: accommodationResults,
        tours: tourResults,
        transport: transportResults,
        total: accommodationResults.length + tourResults.length + transportResults.length
      }
    }
  }
}

// Create singleton instance
export const mockAPI = new MockAPI()

// Export mock API methods that match the real API interface
export const mockApiService = {
  auth: {
    login: (credentials) => mockAPI.login(credentials),
    signup: (userData) => mockAPI.signup(userData),
    logout: () => mockAPI.logout(),
    forgotPassword: (email) => mockAPI.forgotPassword(email),
    resetPassword: (token, password) => mockAPI.resetPassword(token, password),
    // Social login (Google) - finds or creates a user based on email
    socialSignIn: async (profile) => {
      await delay()
      const user = mockUsers.find(u => u.email === profile.email)
      if (user) {
        const token = `mock_token_${user.id}_${Date.now()}`
        localStorage.setItem('auth_token', token)
        mockAPI.authToken = token
        mockAPI.currentUser = user
        return {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            verified: user.verified
          }
        }
      }

      // Create a new user
      const newUser = {
        id: generateId(),
        email: profile.email,
        firstName: profile.firstName || profile.given_name || '',
        lastName: profile.lastName || profile.family_name || '',
        phone: profile.phone || null,
        role: 'user',
        avatar: profile.picture || null,
        verified: true
      }

      mockUsers.push(newUser)
      const token = `mock_token_${newUser.id}_${Date.now()}`
      localStorage.setItem('auth_token', token)
      mockAPI.authToken = token
      mockAPI.currentUser = newUser

      return {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          role: newUser.role,
          avatar: newUser.avatar,
          verified: newUser.verified
        }
      }
    }
  },
  accommodations: {
    getAll: (params) => mockAPI.getAccommodations(params),
    getById: (id) => mockAPI.getAccommodationById(id),
    search: (query) => mockAPI.search(query)
  },
  tours: {
    getAll: (params) => mockAPI.getTours(params),
    getById: (id) => mockAPI.getTourById(id),
    book: (tourId, data) => mockAPI.createBooking({ ...data, type: 'tour', tourId })
  },
  transport: {
    getRoutes: (params) => mockAPI.getTransportOptions(params),
    getVehicles: (params) => mockAPI.getTransportOptions(params),
    book: (data) => mockAPI.createBooking({ ...data, type: 'transport' })
  },
  services: {
    getAll: (params) => mockAPI.getServices(params)
  },
  bookings: {
    create: (bookingData) => mockAPI.createBooking(bookingData),
    getById: (id) => mockAPI.getBookingById(id),
    getMyBookings: () => mockAPI.getMyBookings(),
    cancel: (id) => mockAPI.cancelBooking(id)
  },
  user: {
    getProfile: () => mockAPI.getProfile(),
    updateProfile: (data) => mockAPI.updateProfile(data)
  },
  payments: {
    createIntent: (amount, currency) => mockAPI.createPaymentIntent(amount, currency),
    confirm: (intentId) => mockAPI.confirmPayment(intentId)
  }
}

export default mockApiService
