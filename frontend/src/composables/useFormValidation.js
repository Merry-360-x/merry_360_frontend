import { ref, reactive } from 'vue'

/**
 * Composable for form validation
 * Provides reactive error tracking and validation methods
 */
export const useFormValidation = () => {
  const errors = reactive({})
  const isValidating = ref(false)
  const isValid = ref(true)

  /**
   * Validate a single field
   */
  const validateField = (fieldName, value, validator) => {
    const error = validator(value)
    if (error) {
      errors[fieldName] = error
      return false
    } else {
      delete errors[fieldName]
      return true
    }
  }

  /**
   * Validate all fields
   */
  const validateAll = (fields, validators) => {
    isValidating.value = true
    let hasErrors = false

    // Clear previous errors
    Object.keys(errors).forEach(key => delete errors[key])

    // Validate each field
    Object.entries(fields).forEach(([fieldName, value]) => {
      if (validators[fieldName]) {
        const error = validators[fieldName](value, fields)
        if (error) {
          errors[fieldName] = error
          hasErrors = true
        }
      }
    })

    isValid.value = !hasErrors
    isValidating.value = false
    return !hasErrors
  }

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    isValid.value = true
  }

  /**
   * Clear error for specific field
   */
  const clearFieldError = (fieldName) => {
    delete errors[fieldName]
  }

  /**
   * Set custom error
   */
  const setError = (fieldName, message) => {
    errors[fieldName] = message
    isValid.value = false
  }

  /**
   * Check if field has error
   */
  const hasError = (fieldName) => {
    return !!errors[fieldName]
  }

  /**
   * Get error message for field
   */
  const getError = (fieldName) => {
    return errors[fieldName] || null
  }

  return {
    errors,
    isValidating,
    isValid,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    setError,
    hasError,
    getError
  }
}
