const Product = require('../models/Product');
const ApiError = require('./apiError');

const buildOrderItems = async (orderItems) => {
  const productIds = orderItems.map((item) => item.product);
  const products = await Product.find({
    _id: { $in: productIds },
    isPublished: true,
  }).select('name price discountPrice stock images sku');

  if (products.length !== productIds.length) {
    throw new ApiError(404, 'One or more products were not found.');
  }

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return orderItems.map((item) => {
    const product = productMap.get(String(item.product));

    if (!product) {
      throw new ApiError(404, 'A selected product no longer exists.');
    }

    if (product.stock < item.quantity) {
      throw new ApiError(409, `Only ${product.stock} item(s) left in stock for ${product.name}.`);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: item.quantity,
      image: product.images[0]?.url || '',
      sku: product.sku,
    };
  });
};

const applyStockForOrder = async (order) => {
  if (order.isStockProcessed) {
    return order;
  }

  const stockOperations = order.orderItems.map((item) => ({
    updateOne: {
      filter: {
        _id: item.product,
        stock: { $gte: item.quantity },
      },
      update: {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      },
    },
  }));

  const result = await Product.bulkWrite(stockOperations);

  if (result.modifiedCount !== order.orderItems.length) {
    throw new ApiError(409, 'Unable to reserve stock for one or more products.');
  }

  order.isStockProcessed = true;
  return order;
};

const restoreStockForOrder = async (order) => {
  if (!order.isStockProcessed) {
    return order;
  }

  await Product.bulkWrite(
    order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            stock: item.quantity,
            sold: -item.quantity,
          },
        },
      },
    }))
  );

  order.isStockProcessed = false;
  return order;
};

const isValidStatusTransition = (currentStatus, nextStatus) => {
  const allowedTransitions = {
    Pending: ['Paid', 'Cancelled'],
    Paid: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: [],
  };

  return allowedTransitions[currentStatus]?.includes(nextStatus) || currentStatus === nextStatus;
};

const updateOrderLifecycle = (order, nextStatus) => {
  if (!isValidStatusTransition(order.orderStatus, nextStatus)) {
    throw new ApiError(
      400,
      `Invalid order transition from ${order.orderStatus} to ${nextStatus}.`
    );
  }

  order.orderStatus = nextStatus;

  if (nextStatus === 'Paid' && !order.paidAt) {
    order.paidAt = new Date();
  }

  if (nextStatus === 'Shipped' && !order.shippedAt) {
    order.shippedAt = new Date();
  }

  if (nextStatus === 'Delivered' && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }

  if (nextStatus === 'Cancelled' && !order.cancelledAt) {
    order.cancelledAt = new Date();
  }

  return order;
};

module.exports = {
  buildOrderItems,
  applyStockForOrder,
  restoreStockForOrder,
  isValidStatusTransition,
  updateOrderLifecycle,
};
