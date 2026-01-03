export async function uploadToCloudinary(file, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

  // Validate file size (max 2MB to prevent large uploads)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    throw new Error(`Image size (${sizeMB}MB) exceeds maximum allowed size (2MB). Please compress the image before uploading.`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  // Apply aggressive compression transformations on upload
  formData.append('quality', 'auto:eco') // Eco quality for 10x compression
  formData.append('fetch_format', 'auto') // Auto format (WebP when supported)
  
  if (options.folder) {
    formData.append('folder', options.folder)
  }

  // Use `auto/upload` so the same helper supports both images and videos.
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  const data = await response.json()
  return data
}

export default { uploadToCloudinary }
