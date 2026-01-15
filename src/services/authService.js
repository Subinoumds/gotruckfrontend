import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    // Le cookie HttpOnly est automatiquement géré par le navigateur
    // On stocke aussi le token dans localStorage comme fallback
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  async signup(userData) {
    const response = await api.post('/auth/signup', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },
}
