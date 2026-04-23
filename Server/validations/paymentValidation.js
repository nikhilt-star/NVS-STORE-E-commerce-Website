const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const createPaymentIntentValidation = [
  param('orderId').isMongoId().withMessage('Invalid order id.'),
  validateRequest,
];

const verifyPaymentValidation = [
  body('orderId').isMongoId().withMessage('Invalid order id.'),
  body('razorpay_order_id').trim().notEmpty().withMessage('razorpay_order_id is required.'),
  body('razorpay_payment_id').trim().notEmpty().withMessage('razorpay_payment_id is required.'),
  body('razorpay_signature').trim().notEmpty().withMessage('razorpay_signature is required.'),
  validateRequest,
];

module.exports = {
  createPaymentIntentValidation,
  verifyPaymentValidation,
};
