const crypto = require('crypto');
const Razorpay = require('razorpay');

const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const {
  applyStockForOrder,
  updateOrderLifecycle,
} = require('../utils/orderHelpers');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Razorpay is not configured.');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const ensureOrderAccess = (order, user) => {
  if (user.role === 'admin') {
    return;
  }

  const orderUserId = order.user?._id || order.user;

  if (String(orderUserId) !== String(user._id)) {
    throw new ApiError(403, 'You are not allowed to access this order payment.');
  }
};

const getPaymentConfig = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || null,
    currency: 'INR',
  });
});

const createPaymentIntent = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  ensureOrderAccess(order, req.user);

  if (order.orderStatus === 'Paid' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    throw new ApiError(400, 'Payment has already been completed for this order.');
  }

  if (order.orderStatus === 'Cancelled') {
    throw new ApiError(400, 'Cancelled orders cannot be paid.');
  }

  const razorpay = getRazorpayInstance();
  const paymentOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId: String(order.user),
    },
  });

  order.paymentInfo.provider = 'razorpay';
  order.paymentInfo.status = 'pending';
  order.paymentInfo.currency = paymentOrder.currency;
  order.paymentInfo.amount = paymentOrder.amount;
  order.paymentInfo.razorpayOrderId = paymentOrder.id;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment intent created successfully.',
    paymentOrder,
    orderId: order._id,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await Order.findById(req.body.orderId).populate('user', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  ensureOrderAccess(order, req.user);

  if (order.orderStatus === 'Paid' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    return res.status(200).json({
      success: true,
      message: 'Order is already marked as paid.',
      order,
    });
  }

  if (!order.paymentInfo.razorpayOrderId) {
    throw new ApiError(400, 'No Razorpay order exists for this order yet.');
  }

  if (order.paymentInfo.razorpayOrderId !== req.body.razorpay_order_id) {
    throw new ApiError(400, 'Razorpay order id does not match the stored order.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== req.body.razorpay_signature) {
    order.paymentInfo.status = 'failed';
    await order.save();
    throw new ApiError(400, 'Payment verification failed.');
  }

  order.paymentInfo.status = 'paid';
  order.paymentInfo.razorpayPaymentId = req.body.razorpay_payment_id;
  order.paymentInfo.razorpaySignature = req.body.razorpay_signature;

  updateOrderLifecycle(order, 'Paid');
  await applyStockForOrder(order);
  await order.save();

  try {
    await sendEmail({
      email: order.user.email,
      subject: `NVS Order Confirmation - ${order.orderNumber}`,
      message: `Hi ${order.user.name}, your payment for order ${order.orderNumber} was successful. Total paid: INR ${order.totalPrice}.`,
    });
  } catch (error) {
    logger.warn(`Order confirmation email failed for ${order.orderNumber}: ${error.message}`);
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully.',
    order,
  });
});

module.exports = {
  getPaymentConfig,
  createPaymentIntent,
  verifyPayment,
};
