import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Helper pour construire l'URL complète d'une image
export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl
  }
  // Sinon, c'est une URL relative du backend
  return `${API_URL}${photoUrl}`
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour les cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
})

// Variable pour éviter les refresh multiples simultanés
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Intercepteur pour ajouter le token Bearer si présent (fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs 401 et refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 et token expiré, on tente un refresh
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Si un refresh est déjà en cours, on met la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Appel au endpoint de refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true
        })
        
        const { token } = response.data
        
        if (token) {
          localStorage.setItem('token', token)
          api.defaults.headers.Authorization = `Bearer ${token}`
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        
        processQueue(null, token)
        
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        
        // Si le refresh échoue, on déconnecte l'utilisateur
        localStorage.removeItem('token')
        
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/signup') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Pour les autres erreurs 401 (token invalide, pas de token)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/signup') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
