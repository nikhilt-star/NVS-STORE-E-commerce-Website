const express = require('express');

const productController = require('../controllers/productController');
const { authorize } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/uploadMiddleware');
const {
  createProductValidation,
  productIdValidation,
  reviewValidation,
  updateProductValidation,
} = require('../validations/productValidation');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.post('/:id/reviews', protect, reviewValidation, productController.addProductReview);
router.get('/:id', productIdValidation, productController.getProductById);
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadLimiter,
  upload.array('images', 5),
  createProductValidation,
  productController.createProduct
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadLimiter,
  upload.array('images', 5),
  updateProductValidation,
  productController.updateProduct
);
router.delete('/:id', protect, authorize('admin'), productIdValidation, productController.deleteProduct);

module.exports = router;
