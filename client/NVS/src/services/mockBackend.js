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
      user,
    })
  }

  if (method === 'post' && url === '/auth/register') {
    return makeResponse(config, {
      user: {
        ...mockUsers.customer,
        name: body.name || mockUsers.customer.name,
        email: body.email || mockUsers.customer.email,
        phone: body.phone || mockUsers.customer.phone,
      },
    })
  }

  if (method === 'post' && url === '/auth/logout') {
    return makeResponse(config, {
      success: true,
      message: 'Logout successful.',
    })
  }

  if (method === 'get' && url === '/auth/me') {
    return makeResponse(config, {
      user: mockUsers.customer,
    })
  }

  if (method === 'get' && url === '/orders/mine') {
    return makeResponse(config, {
      orders: mockOrders,
    })
  }

  if (method === 'post' && url === '/orders') {
    const items = body.orderItems || []
    const total = items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.product || entry.id === item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)

    return makeResponse(config, {
      order: {
        _id: `order-${Date.now()}`,
        orderNumber: `NVS-${Date.now()}`,
        orderStatus: 'Pending',
        totalPrice: total,
        orderItems: items,
        createdAt: new Date().toISOString(),
      },
    })
  }

  if (method === 'get' && url === '/payments/config') {
    return makeResponse(config, {
      key: 'rzp_test_mock',
      currency: 'INR',
    })
  }

  if (method === 'post' && url.startsWith('/payments/create-intent/')) {
    return makeResponse(config, {
      paymentOrder: {
        id: `pay_${Date.now()}`,
        amount: 1000,
        currency: 'INR',
      },
      orderId: url.split('/').pop(),
    })
  }

  if (method === 'post' && url === '/payments/verify') {
    return makeResponse(config, {
      order: {
        _id: body.orderId,
        orderNumber: `NVS-${Date.now()}`,
        orderStatus: 'Paid',
        totalPrice: 10,
        createdAt: new Date().toISOString(),
      },
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
