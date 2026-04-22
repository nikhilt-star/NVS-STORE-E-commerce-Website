import { handleImageUtils } from '../../helpers/cloudinary.helper.js'
import { ProductModel } from '../../models/Product.js'

export async function handleImageUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            })
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const url = 'data:' + req.file.mimetype + ';base64,' + b64
        const result = await handleImageUtils(url)

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: result
        })
    } catch (error) {
        console.error('Error in handleImageUpload:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred while uploading image',
            error: error.message
        })
    }
}

export async function addProduct(req, res) {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body

        const newCreateProduct = new ProductModel({
            image, title, description, category, brand, price, salePrice, totalStock
        })

        await newCreateProduct.save()

        res.status(201).json({
            success: true,
            data: newCreateProduct
        })

    } catch (error) {
        console.error('Error to Add Product:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred ....',
            error: error.message
        })
    }
}

export async function fetchAllProducts(req, res) {
    try {
        const listOfProducts = await ProductModel.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts
        })

    } catch (error) {
        console.error('Error to Add Product:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred ....',
            error: error.message
        })
    }
}

export async function editProducts(req, res) {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body

        let findProduct = await ProductModel.findById(id);

        if (!findProduct) {
            return res.status(404).json({
                message: "Product not Found",
                success: false
            })

            findProduct.title = title || findProduct.title
            findProduct.description = description || findProduct.description
            findProduct.category = category || findProduct.category
            findProduct.brand = brand || findProduct.brand
            findProduct.price = price === '' ? 0 : price || findProduct.price
            findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice
            findProduct.totalStock = totalStock || findProduct.totalStock
            findProduct.image = image || findProduct.image

            await findProduct.save()
            res.status(200).json({
                success: true,
                data: findProduct
            })
        }

    } catch (error) {
        console.error('Error to Add Product:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred ....',
            error: error.message
        })
    }
}

export async function deleteProducts(req, res) {
    try {
        const { id } = req.params
        const product = await ProductModel.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not Found",
                success: false
            })
            res.status(200).json({
                success: true,
                message: 'Product Deleted Successfully'
            })
        }

    } catch (error) {
        console.error('Error to Add Product:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred ....',
            error: error.message
        })
    }
}