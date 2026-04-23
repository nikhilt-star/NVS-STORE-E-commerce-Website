import api from './api'
import { normalizeProduct } from '../utils/normalizers'

const buildProductQuery = ({ tab, ...params }) => {
  const query = { ...params }

  if (tab === 'bestsellers') {
    query.featured = true
    query.sort = '-ratings,-createdAt'
  }

  if (tab === 'arrivals' || tab === 'sale') {
    query.sort = '-createdAt'
  }

  return { query, tab }
}

export const productService = {
  async getProducts(params = {}) {
    const { query, tab } = buildProductQuery(params)
    const response = await api.get('/products', { params: query })
    let products = (response.data.products || []).map(normalizeProduct)

    if (tab === 'bestsellers' && !products.length) {
      const fallbackResponse = await api.get('/products', {
        params: {
          ...params,
          sort: '-ratings,-createdAt',
        },
      })

      products = (fallbackResponse.data.products || []).map(normalizeProduct)
    }

    if (tab === 'sale') {
      return products.filter((product) => product.originalPrice > product.price)
    }

    return products
  },

  async getProductById(productId) {
    const response = await api.get(`/products/${productId}`)
    return normalizeProduct(response.data.product)
  },

  async getCategories() {
    const response = await api.get('/products/categories')
    return response.data.categories || []
  },
}
