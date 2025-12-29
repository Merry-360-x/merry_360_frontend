/**
 * Form validation utilities
 */

export const validators = {
  // Email validation
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return null
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
    return null
  },

  // Password confirmation
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  },

  // Required field
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`
    }
    return null
  },

  // Phone number validation (Rwanda format)
  phone: (value) => {
    if (!value) return 'Phone number is required'
    // Rwanda phone format: +250 7XX XXX XXX or 07XX XXX XXX
    const phoneRegex = /^(\+?250|0)?7[0-9]{8}$/
    const cleanPhone = value.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid Rwanda phone number (e.g., +250 7XX XXX XXX)'
    }
    return null
  },

  // Credit card number validation (Luhn algorithm)
  creditCard: (value) => {
    if (!value) return 'Card number is required'
    const cleanCard = value.replace(/\s/g, '')
    if (!/^\d{13,19}$/.test(cleanCard)) return 'Please enter a valid card number'
    
    // Luhn algorithm
    let sum = 0
    let isEven = false
    for (let i = cleanCard.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCard[i])
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    
    if (sum % 10 !== 0) return 'Invalid card number'
    return null
  },

  // Card expiry validation (MM/YY)
  cardExpiry: (value) => {
    if (!value) return 'Expiry date is required'
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(value)) return 'Format should be MM/YY'
    
    const [month, year] = value.split('/')
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    const now = new Date()
    
    if (expiry < now) return 'Card has expired'
    return null
  },

  // CVV validation
  cvv: (value) => {
    if (!value) return 'CVV is required'
    if (!/^\d{3,4}$/.test(value)) return 'CVV must be 3 or 4 digits'
    return null
  },

  // Name validation
  name: (value) => {
    if (!value) return 'Name is required'
    if (value.trim().length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    return null
  },

  // Terms acceptance
  terms: (value) => {
    if (!value) return 'You must accept the terms and conditions'
    return null
  },

  // Date validation (must be future date)
  futureDate: (value) => {
    if (!value) return 'Date is required'
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) return 'Please select a future date'
    return null
  },

  // Check-out date validation (must be after check-in)
  checkOutDate: (checkIn, checkOut) => {
    if (!checkOut) return 'Check-out date is required'
    if (!checkIn) return null // Will be caught by check-in validation
    
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    
    if (checkOutDate <= checkInDate) return 'Check-out must be after check-in date'
    return null
  },

  // Number of guests validation
  guests: (value) => {
    if (!value) return 'Number of guests is required'
    const num = parseInt(value)
    if (isNaN(num) || num < 1) return 'Please enter a valid number of guests'
    if (num > 20) return 'Maximum 20 guests allowed'
    return null
  }
}

/**
 * Validate multiple fields at once
 * @param {Object} fields - Object with field names as keys and values to validate
 * @param {Object} rules - Object with field names as keys and validator functions as values
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateForm = (fields, rules) => {
  const errors = {}
  
  for (const [fieldName, value] of Object.entries(fields)) {
    if (rules[fieldName]) {
      const error = rules[fieldName](value, fields)
      if (error) errors[fieldName] = error
    }
  }
  
  return errors
}

/**
 * Format credit card number with spaces
 */
export const formatCardNumber = (value) => {
  return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

/**
 * Format card expiry
 */
export const formatCardExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
  }
  return cleaned
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.startsWith('250')) {
    return '+250 ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6, 9) + ' ' + cleaned.slice(9, 12)
  }
  if (cleaned.startsWith('0')) {
    return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7, 10)
  }
  return value
}
