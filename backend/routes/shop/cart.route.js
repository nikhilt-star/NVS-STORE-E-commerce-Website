import express from 'express'
import * as cart from '../../controllers/shop/cart.controller.js'

const router = express.Router()

router.post('/add',cart.addToCart)
router.get('/add',cart.fetcheCartItems)
router.put('/add',cart.updatecartItems)
router.delete('/add',cart.deleteCartItems)

export default router