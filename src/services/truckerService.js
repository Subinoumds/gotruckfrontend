const API_URL = import.meta.env.VITE_API_URL

const truckerService = {
    // Get all foodtrucks for the current trucker
    async getFoodtrucks() {
        const response = await fetch(`${API_URL}/foodtrucks`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Erreur lors de la récupération des foodtrucks')
        return response.json()
    },

    // Get a specific foodtruck
    async getFoodtruck(id) {
        const response = await fetch(`${API_URL}/foodtrucks/${id}`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Foodtruck non trouvé')
        return response.json()
    },

    // Update a foodtruck
    async updateFoodtruck(id, data) {
        const response = await fetch(`${API_URL}/foodtrucks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Erreur lors de la mise à jour')
        return response.json()
    },

    // Create a new foodtruck
    async createFoodtruck(data) {
        const response = await fetch(`${API_URL}/foodtrucks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Erreur lors de la création')
        return response.json()
    },

    // Upload image
    async uploadImage(file) {
        const formData = new FormData()
        formData.append('photo', file)

        const response = await fetch(`${API_URL}/upload/photo`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        if (!response.ok) throw new Error('Erreur lors de l\'upload')
        const data = await response.json()
        return data.photo_url
    },

    // Activate location
    async activateLocation(id, latitude, longitude) {
        const response = await fetch(`${API_URL}/foodtrucks/${id}/location/activate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ latitude, longitude })
        })
        if (!response.ok) throw new Error('Erreur lors de l\'activation')
        return response.json()
    },

    // Deactivate location
    async deactivateLocation(id) {
        const response = await fetch(`${API_URL}/foodtrucks/${id}/location/deactivate`, {
            method: 'POST',
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Erreur lors de la désactivation')
        return response.json()
    },

    // Get location status
    async getLocationStatus(id) {
        const response = await fetch(`${API_URL}/foodtrucks/${id}/location/status`, {
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Erreur lors de la récupération du statut')
        return response.json()
    }
}

export default truckerService
