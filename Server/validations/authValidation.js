const { body, param } = require('express-validator');

const validateRequest = require('./validateRequest');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ min: 2, max: 60 }),
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Provide a valid email address.').normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Provide a valid phone number.'),
  validateRequest,
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validateRequest,
];

const forgotPasswordValidation = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Provide a valid email address.').normalizeEmail(),
  validateRequest,
];

const resetPasswordValidation = [
  param('token').trim().notEmpty().withMessage('Reset token is required.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  validateRequest,
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.'),
  validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation,
};
