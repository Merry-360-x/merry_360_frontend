/**
 * Booking system constants
 * 
 * Usage:
 *   import { BOOKING, LOYALTY_TIERS, TIMEOUT } from '@/constants/booking'
 */

// API and Network timeouts
export const TIMEOUT = {
  API_REQUEST_MS: 30000,      // 30 seconds for API calls
  UPLOAD_MS: 90000,           // 90 seconds for file uploads (videos can be large)
  AUTH_MS: 10000,             // 10 seconds for auth operations
  SEARCH_DEBOUNCE_MS: 300,    // 300ms debounce for search
  TOAST_DURATION_MS: 4000,    // 4 seconds for toast notifications
}

// Booking configuration
export const BOOKING = {
  MAX_NIGHTS: 30,             // Maximum stay length
  MIN_NIGHTS: 1,              // Minimum stay length
  MAX_GUESTS: 20,             // Maximum guests per booking
  DEFAULT_GUESTS: 2,          // Default guest count
  ADVANCE_BOOKING_DAYS: 365,  // How far in advance can book
  SERVICE_FEE_PERCENT: 0.05,  // 5% service fee
  TAX_PERCENT: 0.03,          // 3% tax
  CANCELLATION_HOURS: 48,     // Free cancellation window
}

// Loyalty tiers
export const LOYALTY_TIERS = {
  BRONZE: { 
    name: 'bronze', 
    minPoints: 0, 
    discount: 0,
    benefits: ['Basic member benefits']
  },
  SILVER: { 
    name: 'silver', 
    minPoints: 1000, 
    discount: 0.02,
    benefits: ['2% discount on bookings', 'Priority support']
  },
  GOLD: { 
    name: 'gold', 
    minPoints: 5000, 
    discount: 0.05,
    benefits: ['5% discount on bookings', 'Free room upgrades', 'Priority support']
  },
  PLATINUM: { 
    name: 'platinum', 
    minPoints: 15000, 
    discount: 0.10,
    benefits: ['10% discount on bookings', 'Free room upgrades', 'VIP concierge', 'Priority support']
  }
}

// Points earned per currency unit spent
export const POINTS_PER_SPEND = {
  RWF: 0.01,    // 1 point per 100 RWF
  USD: 10,      // 10 points per USD
  EUR: 11,      // 11 points per EUR
}

// Property types
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'resort', label: 'Resort' },
  { value: 'lodge', label: 'Lodge' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'cabin', label: 'Cabin' },
]

// Tour categories
export const TOUR_CATEGORIES = [
  { value: 'Nature', label: 'Nature' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Wildlife', label: 'Wildlife' },
  { value: 'Historical', label: 'Historical' },
]

// Vehicle types
export const VEHICLE_TYPES = [
  { value: 'Car', label: 'Car' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Van', label: 'Van' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Minibus', label: 'Minibus' },
  { value: 'Luxury', label: 'Luxury Vehicle' },
]

// Booking statuses
export const BOOKING_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  REFUNDED: 'refunded',
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
}

// User roles
export const USER_ROLES = {
  USER: 'user',
  HOST: 'host',
  VENDOR: 'vendor',
  STAFF: 'staff',
  ADMIN: 'admin',
}

// Image limits
export const IMAGE_LIMITS = {
  MAX_SIZE_MB: 2,             // 2MB for images
  MAX_VIDEO_SIZE_MB: 100,     // 100MB for videos
  MAX_PROPERTY_IMAGES: 20,    // Max images per property
  MAX_TOUR_IMAGES: 15,        // Max images per tour
  MAX_TRANSPORT_IMAGES: 10,   // Max images per transport
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}

export default {
  TIMEOUT,
  BOOKING,
  LOYALTY_TIERS,
  POINTS_PER_SPEND,
  PROPERTY_TYPES,
  TOUR_CATEGORIES,
  VEHICLE_TYPES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  IMAGE_LIMITS,
}
