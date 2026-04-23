const express = require('express');

const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrderValidation,
  orderIdValidation,
} = require('../validations/orderValidation');

const router = express.Router();

router.use(protect);

router.route('/').post(createOrderValidation, orderController.createOrder);
router.get('/mine', orderController.getMyOrders);
router.get('/:id', orderIdValidation, orderController.getOrderById);

module.exports = router;
