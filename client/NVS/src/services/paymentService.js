import api from './api'
import { normalizeOrder } from '../utils/normalizers'

export const paymentService = {
  async getPaymentConfig() {
    const response = await api.get('/payments/config')
    return response.data
  },

  async createPaymentIntent(orderId) {
    const response = await api.post(`/payments/create-intent/${orderId}`)
    return response.data
  },

  async verifyPayment(payload) {
    const response = await api.post('/payments/verify', payload)
    return {
      ...response.data,
      order: normalizeOrder(response.data.order),
    }
  },
}
