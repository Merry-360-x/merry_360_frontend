// Ultra-fast image optimization service

/**
 * Generate optimized Cloudinary URL with progressive loading
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized URL
 */
export function optimizeImageUrl(url, options = {}) {
  const {
    width = 600,
    height = null,
    quality = 'auto:low', // Use low quality for faster loading
    format = 'auto',
    blur = null,
    progressive = true
  } = options

  if (!url) return ''
  
  // If not Cloudinary, return as-is
  if (!url.includes('cloudinary.com')) {
    return url
  }

  // Build transformation string with aggressive compression
  const transformations = []
  
  if (width) {
    transformations.push(`w_${width}`)
  }
  
  if (height) {
    transformations.push(`h_${height}`)
    transformations.push('c_fill') // Crop to fill
  } else {
    transformations.push('c_limit') // Limit dimensions, don't upscale
  }
  
  // Use aggressive quality reduction for faster loading
  transformations.push(`q_${quality}`)
  
  // Auto format selection (WebP for modern browsers)
  transformations.push(`f_${format}`)
  
  if (blur) {
    transformations.push(`e_blur:${blur}`)
  }
  
  if (progressive) {
    transformations.push('fl_progressive')
  }

  // Add compression flags
  transformations.push('fl_lossy') // Lossy compression
  transformations.push('fl_strip_profile') // Remove metadata
  
  // Insert transformations into URL
  const transformString = transformations.join(',')
  return url.replace('/upload/', `/upload/${transformString}/`)
}

/**
 * Generate tiny placeholder for progressive image loading
 * @param {string} url - Original image URL
 * @returns {string} Placeholder URL
 */
export function getPlaceholderUrl(url) {
  return optimizeImageUrl(url, {
    width: 10, // Reduced from 20 to 10 for tiny placeholders
    quality: '1', // Reduced from 10 to 1 for maximum compression
    blur: 2000 // Increased blur since it's just a placeholder
  })
}

/**
 * Lazy load images with intersection observer
 * @param {HTMLElement} img - Image element
 * @param {string} src - Image source
 */
export function lazyLoadImage(img, src) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target
          const placeholder = image.dataset.placeholder
          const fullSrc = image.dataset.src
          
          // Show placeholder first
          if (placeholder) {
            image.src = placeholder
          }
          
          // Load full image
          const fullImg = new Image()
          fullImg.onload = () => {
            image.src = fullSrc
            image.classList.add('loaded')
          }
          fullImg.src = fullSrc
          
          obs.unobserve(image)
        }
      })
    }, {
      rootMargin: '100px' // Start loading 100px before entering viewport
    })
    
    img.dataset.src = src
    img.dataset.placeholder = getPlaceholderUrl(src)
    observer.observe(img)
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src
  }
}

/**
 * Preload critical images
 * @param {Array<string>} urls - Image URLs to preload
 */
export function preloadImages(urls) {
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizeImageUrl(url, { width: 800 })
    document.head.appendChild(link)
  })
}

/**
 * Get responsive image srcset
 * @param {string} url - Original image URL
 * @returns {string} Srcset string
 */
export function getResponsiveSrcset(url) {
  const sizes = [400, 800, 1200, 1600]
  return sizes
    .map(size => `${optimizeImageUrl(url, { width: size })} ${size}w`)
    .join(', ')
}
