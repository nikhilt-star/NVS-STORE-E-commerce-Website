const FALLBACK_SWATCHES = ['#A8CBB7', '#F2D09A', '#C8B6E2', '#D9BBA9']

const formatAddress = (address) => {
  if (!address) {
    return ''
  }

  return [address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ')
}

export const normalizeUser = (user) => {
  if (!user) {
    return null
  }

  const defaultAddress =
    user.addresses?.find((address) => address.isDefault) || user.addresses?.[0] || null

  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
    defaultAddress,
    address: user.address || formatAddress(defaultAddress),
  }
}

export const normalizeProduct = (product) => {
  if (!product) {
    return null
  }

  const effectivePrice = product.discountPrice ?? product.price ?? 0

  return {
    id: product._id || product.id,
    name: product.name,
    category: product.category || 'General',
    price: effectivePrice,
    originalPrice: product.price ?? effectivePrice,
    image: product.images?.[0]?.url || product.image || '',
    images: product.images?.map((image) => image.url) || [],
    badge: product.discountPrice ? 'Sale' : product.featured ? 'Featured' : null,
    rating: product.ratings || product.rating || 0,
    reviewCount: product.numReviews || product.reviewCount || 0,
    swatches: product.swatches?.length ? product.swatches : FALLBACK_SWATCHES,
    description: product.shortDescription || product.description || '',
    fullDescription: product.description || product.shortDescription || '',
    stock: product.stock ?? 0,
    sku: product.sku || '',
  }
}

export const normalizeOrder = (order) => {
  if (!order) {
    return null
  }

  return {
    id: order.orderNumber || order.id || order._id,
    dbId: order._id || order.id,
    status: order.orderStatus || order.status || 'Pending',
    total: order.totalPrice ?? order.total ?? 0,
    date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    items:
      order.orderItems?.map((item) => ({
        productId: item.product?._id || item.product || item.productId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        price: item.price,
      })) || order.items || [],
  }
}
