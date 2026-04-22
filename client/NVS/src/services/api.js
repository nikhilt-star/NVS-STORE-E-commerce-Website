import axios from 'axios'
import { mockAdapter } from './mockBackend'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  adapter: mockAdapter,
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('nvs-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use((response) => response, (error) => Promise.reject(error))

export default api
