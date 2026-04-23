const express = require('express');

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  updatePasswordValidation,
} = require('../validations/authValidation');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, authController.forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, authController.resetPassword);
router.get('/profile', protect, authController.getProfile);
router.get('/me', protect, authController.getProfile);
router.put('/update-password', protect, updatePasswordValidation, authController.updatePassword);

module.exports = router;
