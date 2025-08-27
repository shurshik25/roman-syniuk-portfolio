import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp}']
      },
      manifest: {
        name: 'Портфоліо актора',
        short_name: 'Portfolio',
        description: 'Професійне портфоліо актора з галереєю робіт та відео-репертуаром',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    // Оптимізація збірки
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Code splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          helmet: ['react-helmet-async']
        }
      }
    },
    // Оптимізація chunk розміру
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  },
  // Компресія для dev сервера
  preview: {
    port: 4173,
    host: true
  }
})
