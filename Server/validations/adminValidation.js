const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user id.'),
  validateRequest,
];

const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user id.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  validateRequest,
];

const updateOrderStatusValidation = [
  param('id').isMongoId().withMessage('Invalid order id.'),
  body('orderStatus')
    .trim()
    .notEmpty()
    .withMessage('orderStatus is required.')
    .isIn(['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status.'),
  body('adminNote').optional().trim().isLength({ max: 500 }).withMessage('Admin note cannot exceed 500 characters.'),
  validateRequest,
];

module.exports = {
  userIdValidation,
  updateUserValidation,
  updateOrderStatusValidation,
};
