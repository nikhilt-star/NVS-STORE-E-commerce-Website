import axios from 'axios'
import { mockAdapter } from './mockBackend'

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(useMockApi ? { adapter: mockAdapter } : {}),
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.request) {
      error.userMessage =
        'Unable to reach the server. Check that both frontend and backend are running.'
    } else {
      error.userMessage =
        error.response?.data?.message || 'Something went wrong. Please try again.'
    }

    return Promise.reject(error)
  },
)

export default api
