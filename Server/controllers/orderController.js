const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const {
  applyStockForOrder,
  buildOrderItems,
  restoreStockForOrder,
  updateOrderLifecycle,
} = require('../utils/orderHelpers');

const parseAmount = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  return Number(value);
};

const createOrder = catchAsync(async (req, res) => {
  const orderItems = await buildOrderItems(req.body.orderItems);
  const itemsPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = parseAmount(req.body.taxPrice);
  const shippingPrice = parseAmount(req.body.shippingPrice);
  const discountAmount = parseAmount(req.body.discountAmount);
  const totalPrice = Math.max(itemsPrice + taxPrice + shippingPrice - discountAmount, 0);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
    customerNote: req.body.customerNote,
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully.',
    order,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name slug images');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (req.user.role !== 'admin' && String(order.user._id) !== String(req.user._id)) {
    throw new ApiError(403, 'You are not allowed to access this order.');
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }

  if (req.query.paymentStatus) {
    filter['paymentInfo.status'] = req.query.paymentStatus;
  }

  if (req.query.keyword) {
    filter.orderNumber = new RegExp(req.query.keyword, 'i');
  }

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalOrders,
    totalPages: Math.max(Math.ceil(totalOrders / limit), 1),
    currentPage: page,
    orders,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  const nextStatus = req.body.orderStatus;

  if (req.body.adminNote !== undefined) {
    order.adminNote = req.body.adminNote;
  }

  if (nextStatus !== order.orderStatus) {
    updateOrderLifecycle(order, nextStatus);

    if (nextStatus === 'Paid') {
      order.paymentInfo.status = 'paid';
      await applyStockForOrder(order);
    }

    if (nextStatus === 'Cancelled') {
      order.paymentInfo.status = order.paymentInfo.status === 'paid' ? 'refunded' : order.paymentInfo.status;
      await restoreStockForOrder(order);
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully.',
    order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
