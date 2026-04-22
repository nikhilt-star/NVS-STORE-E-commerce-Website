import api from './api'

export const authService = {
  async login(payload) {
    const response = await api.post('/auth/login', payload)
    return response.data
  },

  async register(payload) {
    const response = await api.post('/auth/register', payload)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },
}
