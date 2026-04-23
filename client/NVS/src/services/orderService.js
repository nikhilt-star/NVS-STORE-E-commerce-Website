import api from './api'
import { normalizeOrder } from '../utils/normalizers'

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders/mine')
    return (response.data.orders || []).map(normalizeOrder)
  },

  async createOrder(payload) {
    const response = await api.post('/orders', payload)
    return normalizeOrder(response.data.order)
  },
}
