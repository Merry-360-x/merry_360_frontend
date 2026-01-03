import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-supabase': ['@supabase/supabase-js'],
          // Split large components
          'admin': [
            './src/views/admin/AdminDashboard.vue',
            './src/views/admin/AdminUsers.vue',
            './src/views/admin/AdminAccommodations.vue'
          ],
          'vendor': [
            './src/views/vendor/VendorDashboard.vue',
            './src/views/vendor/CreateProperty.vue'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@supabase/supabase-js']
  }
})
