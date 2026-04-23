const express = require('express');

const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const {
  addressIdValidation,
  addressValidation,
  updateProfileValidation,
} = require('../validations/userValidation');

const router = express.Router();

router.use(protect);

router.route('/profile').put(updateProfileValidation, userController.updateProfile);
router.route('/addresses').get(userController.getAddresses).post(addressValidation, userController.addAddress);
router
  .route('/addresses/:addressId')
  .put(addressIdValidation, addressValidation, userController.updateAddress)
  .delete(addressIdValidation, userController.deleteAddress);
router.get('/orders', userController.getOrderHistory);

module.exports = router;
