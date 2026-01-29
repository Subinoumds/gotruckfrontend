import api from './api'

const userService = {
    // Get current user profile
    async getProfile() {
        const response = await api.get('/auth/me')
        return response.data
    },

    // Update user profile information
    async updateProfile(data) {
        const response = await api.put('/auth/profile', data)
        return response.data
    },

    // Update password
    async updatePassword(currentPassword, newPassword) {
        const response = await api.put('/auth/password', {
            currentPassword,
            newPassword
        })
        return response.data
    }
}

export default userService
