const express = require('express');

const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const {
  createPaymentIntentValidation,
  verifyPaymentValidation,
} = require('../validations/paymentValidation');

const router = express.Router();

router.use(protect);

router.get('/config', paymentController.getPaymentConfig);
router.post(
  '/create-intent/:orderId',
  createPaymentIntentValidation,
  paymentController.createPaymentIntent
);
router.post('/verify', verifyPaymentValidation, paymentController.verifyPayment);

module.exports = router;
