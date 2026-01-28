import api from './api'

export const favoriService = {
  // Récupérer tous les favoris de l'utilisateur
  async getAll() {
    const response = await api.get('/favoris')
    return response.data
  },

  // Récupérer juste les IDs des favoris
  async getIds() {
    const response = await api.get('/favoris/ids')
    return response.data
  },

  // Vérifier si un foodtruck est en favori
  async check(foodtruckId) {
    const response = await api.get(`/favoris/check/${foodtruckId}`)
    return response.data.isFavorite
  },

  // Ajouter un foodtruck en favori
  async add(foodtruckId) {
    const response = await api.post(`/favoris/${foodtruckId}`)
    return response.data
  },

  // Supprimer un foodtruck des favoris
  async remove(foodtruckId) {
    const response = await api.delete(`/favoris/${foodtruckId}`)
    return response.data
  },

  // Toggle favori (ajouter ou supprimer)
  async toggle(foodtruckId) {
    const response = await api.post(`/favoris/${foodtruckId}/toggle`)
    return response.data
  },
}
