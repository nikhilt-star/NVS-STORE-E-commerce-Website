const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const createOrderValidation = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item.'),
  body('orderItems.*.product').isMongoId().withMessage('Each order item must have a valid product id.'),
  body('orderItems.*.quantity').isInt({ min: 1, max: 100 }).withMessage('Each item quantity must be between 1 and 100.'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Shipping full name is required.'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Shipping phone is required.'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Shipping address line 1 is required.'),
  body('shippingAddress.line2').optional().trim(),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required.'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required.'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Shipping postal code is required.'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Shipping country is required.'),
  body('taxPrice').optional().isFloat({ min: 0 }).withMessage('taxPrice cannot be negative.'),
  body('shippingPrice').optional().isFloat({ min: 0 }).withMessage('shippingPrice cannot be negative.'),
  body('discountAmount').optional().isFloat({ min: 0 }).withMessage('discountAmount cannot be negative.'),
  body('customerNote').optional().trim().isLength({ max: 500 }).withMessage('Customer note cannot exceed 500 characters.'),
  validateRequest,
];

const orderIdValidation = [
  param('id').isMongoId().withMessage('Invalid order id.'),
  validateRequest,
];

module.exports = {
  createOrderValidation,
  orderIdValidation,
};
