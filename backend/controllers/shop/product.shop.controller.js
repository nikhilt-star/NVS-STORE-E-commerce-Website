import { ProductModel } from "../../models/Product.js"

export async function getFilteredProducts(req, res) {
    try {

        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query

        let filters = {}

        if (category.length) {
            filters.category = { $in: category.split(',') }
        }

        if (brand.length) {
            filters.brand = { $in: brand.split(',') }
        }

        let sort = {}

        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1
                break;

            case 'price-hightolow':
                sort.price = -1
                break;

            case 'title-atoz':
                sort.price = 1
                break;

            case 'title-ztoa':
                sort.price = -1
                break;

            default:
                sort.price = 1
                break;
        }

        const products = await ProductModel.find(filters).sort(sort)

        res.status(200).json({
            success: true,
            data: products
        })

    } catch (error) {
        console.error('Error in handleImageUpload:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred while Filtering'
        })
    }
}

export async function getProductDetails(req, res) {
    try {
        const { id } = req.params
        const product = await ProductModel.findById(id)

        if (!product) {
            return res.status().json({
                success: false,
                message: "Product not Found"
            })

            res.status(200).json({
                success: true,
                data: product
            })
        }

    } catch (error) {
        console.error('Error in handleImageUpload:', error)
        res.status(500).json({
            success: false,
            message: 'Error occurred while getProductDetails'
        })
    }
}