const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const specificationValidator = body('specifications').optional().custom((value) => {
  if (typeof value === 'string') {
    JSON.parse(value);
    return true;
  }

  if (Array.isArray(value)) {
    return true;
  }

  throw new Error('Specifications must be a valid JSON array or array of key/value pairs.');
});

const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.').isLength({ min: 20 }).withMessage('Description must be at least 20 characters long.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('price').notEmpty().withMessage('Price is required.').isFloat({ gt: 0 }).withMessage('Price must be greater than zero.'),
  body('discountPrice')
    .optional({ values: 'falsy' })
    .isFloat({ gt: 0 })
    .withMessage('Discount price must be greater than zero.')
    .custom((value, { req }) => Number(value) <= Number(req.body.price))
    .withMessage('Discount price cannot be greater than regular price.'),
  body('stock').notEmpty().withMessage('Stock is required.').isInt({ min: 0 }).withMessage('Stock cannot be negative.'),
  body('sku').trim().notEmpty().withMessage('SKU is required.'),
  body('brand').optional().trim(),
  body('shortDescription').optional().trim().isLength({ max: 240 }).withMessage('Short description cannot exceed 240 characters.'),
  body('featured').optional().isBoolean().withMessage('featured must be a boolean.'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean.'),
  specificationValidator,
  validateRequest,
];

const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid product id.'),
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty.'),
  body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters long.'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty.'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than zero.'),
  body('discountPrice')
    .optional({ values: 'falsy' })
    .isFloat({ gt: 0 })
    .withMessage('Discount price must be greater than zero.')
    .custom((value, { req }) => req.body.price === undefined || Number(value) <= Number(req.body.price))
    .withMessage('Discount price cannot be greater than regular price.'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative.'),
  body('featured').optional().isBoolean().withMessage('featured must be a boolean.'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean.'),
  body('replaceImages').optional().isBoolean().withMessage('replaceImages must be a boolean.'),
  specificationValidator,
  validateRequest,
];

const productIdValidation = [
  param('id').isMongoId().withMessage('Invalid product id.'),
  validateRequest,
];

const reviewValidation = [
  param('id').isMongoId().withMessage('Invalid product id.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment').trim().notEmpty().withMessage('Comment is required.').isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters.'),
  validateRequest,
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  reviewValidation,
};
