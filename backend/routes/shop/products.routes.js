import express from 'express'
import * as products from '../../controllers/shop/product.shop.controller.js'

const router = express.Router()

router.post('/get', products.getFilteredProducts)
router.post('/get/:id', products.getProductDetails)


export default router
