/**
 * Mock Data Service
 * Simulates backend data for MVP development
 */

export const mockAccommodations = []

export const mockTours = []

export const mockTransportOptions = []

export const mockServices = []

// Mock users removed - All users are now real accounts created through Supabase authentication
// Users register via /signup and login via /login
// Real user data is stored in Supabase profiles table
export const mockUsers = []

export const mockBookings = []

// Helper functions to simulate API delays
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)
