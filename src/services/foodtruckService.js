import api from './api'

export const foodtruckService = {
  async getNearby(lat, lng, radiusKm = 5, date = null, from = null, to = null, limit = 50, offset = 0, extraFilters = {}) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius_km: radiusKm.toString(),
      limit: limit.toString(),
      offset: offset.toString(),
    })
    if (date) params.append('date', date)
    if (from) params.append('from', from)
    if (to) params.append('to', to)

    // Add extra filters
    if (extraFilters.q) params.append('q', extraFilters.q)
    if (extraFilters.type) params.append('type', extraFilters.type)
    if (extraFilters.type_cuisine) params.append('type_cuisine', extraFilters.type_cuisine)

    const response = await api.get(`/foodtrucks/nearby/search?${params.toString()}`)
    return response.data
  },

  async getAll(filters = {}) {
    const params = new URLSearchParams()
    if (filters.q) params.append('q', filters.q)
    if (filters.type) params.append('type', filters.type)
    if (filters.type_cuisine) params.append('type_cuisine', filters.type_cuisine)
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.offset) params.append('offset', filters.offset.toString())

    const response = await api.get(`/foodtrucks?${params.toString()}`)
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/foodtrucks/${id}`)
    return response.data
  },
}
