import api from './api'

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response.data
  },

  async getProductById(productId) {
    const response = await api.get(`/products/${productId}`)
    return response.data
  },

  async getCategories() {
    const response = await api.get('/categories')
    return response.data
  },
}
