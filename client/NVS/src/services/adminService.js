import api from './api'
import { normalizeOrder, normalizeProduct, normalizeUser } from '../utils/normalizers'

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard')
    return response.data.stats
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params })
    return {
      ...response.data,
      users: (response.data.users || []).map(normalizeUser),
    }
  },

  async updateUserStatus(userId, isActive) {
    const response = await api.patch(`/admin/users/${userId}`, { isActive })
    return {
      ...response.data,
      user: normalizeUser(response.data.user),
    }
  },

  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params })
    return {
      ...response.data,
      orders: (response.data.orders || []).map(normalizeOrder),
    }
  },

  async updateOrderStatus(orderId, orderStatus) {
    const response = await api.patch(`/admin/orders/${orderId}`, { orderStatus })
    return {
      ...response.data,
      order: normalizeOrder(response.data.order),
    }
  },

  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params })
    return {
      ...response.data,
      products: (response.data.products || []).map(normalizeProduct),
    }
  },

  async createProduct(payload) {
    const response = await api.post('/products', payload)
    return {
      ...response.data,
      product: normalizeProduct(response.data.product),
    }
  },

  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`)
    return response.data
  },
}

