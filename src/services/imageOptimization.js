// Ultra-fast image optimization service

/**
 * Generate optimized Cloudinary URL with progressive loading
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized URL
 */
export function optimizeImageUrl(url, options = {}) {
  const {
    width = 800,
    quality = 'auto:best',
    format = 'auto',
    blur = null,
    progressive = true
  } = options

  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  // Build transformation string
  const transformations = []
  
  if (width) {
    transformations.push(`w_${width}`)
  }
  
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  
  if (blur) {
    transformations.push(`e_blur:${blur}`)
  }
  
  if (progressive) {
    transformations.push('fl_progressive')
  }

  // Add lazy loading flag
  transformations.push('fl_lossy')
  
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
    width: 20,
    quality: '10',
    blur: 1000
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
