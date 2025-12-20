/**
 * Integrated Storage Service
 * Combines Cloudinary (for images) with Supabase Storage (for other files)
 */

import { supabase } from './supabase'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options (folder, tags, etc.)
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadImageToCloudinary(file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  
  if (options.folder) {
    formData.append('folder', options.folder)
  }
  
  if (options.tags && Array.isArray(options.tags)) {
    formData.append('tags', options.tags.join(','))
  }
  
  if (options.context) {
    const contextString = Object.entries(options.context)
      .map(([key, value]) => `${key}=${value}`)
      .join('|')
    formData.append('context', contextString)
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Cloudinary upload failed')
    }

    const data = await response.json()
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      thumbnail: data.eager?.[0]?.secure_url || data.secure_url
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<Object[]>} Array of upload results
 */
export async function uploadMultipleImages(files, options = {}) {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file, options))
  return await Promise.all(uploadPromises)
}

/**
 * Upload profile avatar and save to Supabase
 * @param {string} userId - User ID
 * @param {File} file - Avatar image file
 * @returns {Promise<string>} Avatar URL
 */
export async function uploadUserAvatar(userId, file) {
  const result = await uploadImageToCloudinary(file, {
    folder: 'merry360/avatars',
    tags: ['avatar', userId],
    context: { userId }
  })

  // Update user profile with avatar URL
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: result.url })
    .eq('id', userId)

  if (error) throw error

  return result.url
}

/**
 * Upload listing images and return URLs
 * @param {string} listingId - Listing ID
 * @param {File[]} files - Image files
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function uploadListingImages(listingId, files) {
  const results = await uploadMultipleImages(files, {
    folder: 'merry360/listings',
    tags: ['listing', listingId],
    context: { listingId }
  })

  return results.map(r => r.url)
}

/**
 * Upload file to Supabase Storage (for non-image files)
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path in bucket
 * @param {File} file - File to upload
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadFileToSupabase(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
export async function deleteImageFromCloudinary(publicId) {
  // Note: Direct deletion requires authenticated requests
  // For production, implement this via your backend
  console.warn('Image deletion should be handled server-side')
}

/**
 * Get optimized image URL from Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {Object} transforms - Transformation options
 * @returns {string} Transformed URL
 */
export function getOptimizedImageUrl(url, transforms = {}) {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const {
    width = 800,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = transforms

  // Insert transformations into Cloudinary URL
  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transformString = [
    width && `w_${width}`,
    height && `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`
  ].filter(Boolean).join(',')

  return `${parts[0]}/upload/${transformString}/${parts[1]}`
}

/**
 * Create image gallery for listing with Supabase record update
 * @param {string} listingId - Listing ID
 * @param {File[]} files - Image files
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function createListingGallery(listingId, files) {
  // Upload images to Cloudinary
  const imageUrls = await uploadListingImages(listingId, files)

  // Update listing with image URLs
  const { error } = await supabase
    .from('listings')
    .update({ images: imageUrls })
    .eq('id', listingId)

  if (error) throw error

  return imageUrls
}

/**
 * Upload review images
 * @param {string} reviewId - Review ID
 * @param {File[]} files - Image files
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function uploadReviewImages(reviewId, files) {
  const results = await uploadMultipleImages(files, {
    folder: 'merry360/reviews',
    tags: ['review', reviewId],
    context: { reviewId }
  })

  return results.map(r => r.url)
}

/**
 * Check if Cloudinary is configured
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
}

export default {
  uploadImageToCloudinary,
  uploadMultipleImages,
  uploadUserAvatar,
  uploadListingImages,
  uploadFileToSupabase,
  getOptimizedImageUrl,
  createListingGallery,
  uploadReviewImages,
  isCloudinaryConfigured
}
