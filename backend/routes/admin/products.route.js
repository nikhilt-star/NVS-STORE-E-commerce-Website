import express from 'express'
import * as products from '../../controllers/admin/product.controller.js'
import { upload } from '../../helpers/cloudinary.helper.js'

const router = express.Router()

router.post('/upload-image', upload.single('my_file'), products.handleImageUpload)
router.post('/add', products.addProduct)
router.get('/get', products.fetchAllProducts)
router.put('/edit/:id', products.editProducts)
router.delete('/delete/:id', products.deleteProducts)


export default router
