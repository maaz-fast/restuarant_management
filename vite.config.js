import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy all API requests to backend
      '/api': {
        target: 'https://localhost:7158',
        changeOrigin: true,
        secure: false
      },
      '/user': {
        target: 'https://localhost:7158',
        changeOrigin: true,
        secure: false
      },
      '/menu': {
        target: 'https://localhost:7158',
        changeOrigin: true,
        secure: false
      },
      '/order': {
        target: 'https://localhost:7158',
        changeOrigin: true,
        secure: false
      },
      '/get': {
        target: 'https://localhost:7158',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
