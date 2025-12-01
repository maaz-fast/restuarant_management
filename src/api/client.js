import axios from 'axios'

// Base URL - most endpoints don't use /api prefix, only Contact does
const baseURL = import.meta.env.DEV
  ? '/'  // proxy in dev mode
  : (import.meta.env.VITE_API_URL || 'https://localhost:7158/')

// Helpful runtime log for debugging proxy/baseURL issues in dev
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[api] using dev proxy baseURL ->', baseURL)
} else {
  // eslint-disable-next-line no-console
  console.log('[api] using baseURL ->', baseURL)
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
})

api.interceptors.request.use(
  (config) => {
    // allow callers to opt-out from sending Authorization header
    if (config && config.skipAuth) {
      return config
    }

    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
      console.log('Added Authorization header:', `Bearer ${token.substring(0, 20)}...`)
    } else {
      console.warn('No auth token found in localStorage')
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
