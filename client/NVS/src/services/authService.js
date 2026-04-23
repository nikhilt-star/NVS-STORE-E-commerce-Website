import api from './api'
import { clearStoredToken, setStoredToken } from './authStorage'
import { normalizeUser } from '../utils/normalizers'

export const authService = {
  async login(payload) {
    const response = await api.post('/auth/login', payload)
    setStoredToken(response.data.token)
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    }
  },

  async register(payload) {
    const response = await api.post('/auth/register', payload)
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    }
  },

  async logout() {
    const response = await api.post('/auth/logout')
    clearStoredToken()
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    }
  },
}
