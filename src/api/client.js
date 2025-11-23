import axios from 'axios'

const API_PREFIX = '/api/'

const baseURL = import.meta.env.DEV
  ? API_PREFIX
  : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${API_PREFIX}` : `https://localhost:7152${API_PREFIX}`)

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
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
