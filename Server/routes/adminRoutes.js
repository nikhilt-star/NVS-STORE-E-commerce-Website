const express = require('express');

const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productController');
const { authorize } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  updateOrderStatusValidation,
  updateUserValidation,
  userIdValidation,
} = require('../validations/adminValidation');
const { orderIdValidation } = require('../validations/orderValidation');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', userIdValidation, adminController.getUserById);
router.put('/users/:id', updateUserValidation, adminController.updateUser);
router.delete('/users/:id', userIdValidation, adminController.deleteUser);
router.get('/products', productController.getAdminProducts);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderIdValidation, orderController.getOrderById);
router.put('/orders/:id/status', updateOrderStatusValidation, orderController.updateOrderStatus);

module.exports = router;
