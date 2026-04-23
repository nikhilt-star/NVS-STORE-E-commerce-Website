const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters.'),
  body('email').optional().trim().isEmail().withMessage('Provide a valid email address.').normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Provide a valid phone number.'),
  validateRequest,
];

const addressValidation = [
  body('label').optional().isIn(['home', 'work', 'other']).withMessage('Address label must be home, work, or other.'),
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.').isMobilePhone('any').withMessage('Provide a valid phone number.'),
  body('line1').trim().notEmpty().withMessage('Address line 1 is required.'),
  body('line2').optional().trim(),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required.'),
  body('country').trim().notEmpty().withMessage('Country is required.'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean.'),
  validateRequest,
];

const addressIdValidation = [
  param('addressId').isMongoId().withMessage('Invalid address id.'),
  validateRequest,
];

module.exports = {
  updateProfileValidation,
  addressValidation,
  addressIdValidation,
};
