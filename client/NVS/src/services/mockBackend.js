import { mockOrders, mockUsers, mostLovedCategories, products } from '../data/mockData'

const wait = (delay = 220) => new Promise((resolve) => setTimeout(resolve, delay))

const makeResponse = (config, data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
})

const parseBody = (data) => {
  if (!data) {
    return {}
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }

  return data
}

const getProductIdFromUrl = (url = '') => {
  const match = url.match(/\/products\/([^/?]+)/)
  return match?.[1]
}

export const mockAdapter = async (config) => {
  await wait()

  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const body = parseBody(config.data)

  if (method === 'get' && url === '/products') {
    const tab = config.params?.tab
    const filtered = tab ? products.filter((item) => item.featuredGroup === tab) : products
    return makeResponse(config, filtered)
  }

  if (method === 'get' && url === '/categories') {
    return makeResponse(config, mostLovedCategories)
  }

  if (method === 'get' && url.startsWith('/products/')) {
    const product = products.find((item) => item.id === getProductIdFromUrl(url))
    return makeResponse(config, product ?? null, product ? 200 : 404)
  }

  if (method === 'post' && url === '/auth/login') {
    const user = body.email?.includes('admin') ? mockUsers.admin : mockUsers.customer
    return makeResponse(config, {
      token: `${user.role}-demo-token`,
      user,
    })
  }

  if (method === 'post' && url === '/auth/register') {
    return makeResponse(config, {
      token: 'customer-demo-token',
      user: {
        ...mockUsers.customer,
        name: body.name || mockUsers.customer.name,
        email: body.email || mockUsers.customer.email,
      },
    })
  }

  if (method === 'get' && url === '/auth/profile') {
    const isAdmin = config.headers?.Authorization?.includes('admin')
    return makeResponse(config, isAdmin ? mockUsers.admin : mockUsers.customer)
  }

  if (method === 'get' && url === '/orders') {
    return makeResponse(config, mockOrders)
  }

  if (method === 'post' && url === '/orders') {
    const items = body.items || []
    const total = items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)

    return makeResponse(config, {
      id: `order-${Date.now()}`,
      status: 'Confirmed',
      total,
      items,
      date: new Date().toISOString().slice(0, 10),
    })
  }

  return makeResponse(
    config,
    {
      message: `Mock route for ${method.toUpperCase()} ${url} is not defined.`,
    },
    404,
  )
}
