import api from './api'

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders')
    return response.data
  },

  async createOrder(payload) {
    const response = await api.post('/orders', payload)
    return response.data
  },
}
