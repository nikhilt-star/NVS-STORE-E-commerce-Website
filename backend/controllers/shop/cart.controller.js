import { CartModel } from "../../models/Cart.js";
import { ProductModel } from "../../models/Product.js";

export async function addToCart(req, res) {
    try {

        const { userId, productId, quantity } = req.body

        if (!userId || !productId || !quantity <= 0) {
            res.status(400).json({
                success: false,
                message: 'Errorrr invalid data provided'
            })
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            res.status(400).json({
                success: false,
                message: 'Errorrr invalid data provided'
            })
        }

        let cart = await CartModel.findOne({ userId })

        if (!cart) {
            cart = new CartModel({ userId, items: [] })
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if (findCurrentProductIndex === -1) {
            cart.items.push({ productId, quantity })
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity
        }

        await cart.save()

        res.status(200).json({
            success: true,
            data: cart
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Errorrr add to cart'
        })
    }
}

export async function fetcheCartItems(req, res) {
    try {

        const { userId } = req.params

        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'userId required...'
            })
        }

        const cart = await CartModel.findOne({ userId })
            .populate({
                path: 'item.productId',
                select: 'Image title price salePrice'
            })

        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'Cart not Found...'
            })
        }

        const validItems = cart.items.filter(productItems => productItems.productId
        )

        if (validItems.length < cart.items.length) {
            cart.items = validItems
            await cart.save()
        }

        const populatecartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.productId.quantity,
        }))

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                item: populatecartItems
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Errorrr add to cart'
        })
    }
}

export async function updatecartItems(req, res) {
    try {

        const { userId, productId, quantity } = req.body

        if (!userId || !productId || !quantity <= 0) {
            res.status(400).json({
                success: false,
                message: 'Errorrr invalid data provided'
            })
        }

        const cart = await CartModel.findOne({ userId })

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            })
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            })
        }

        cart.items[findCurrentProductIndex].quantity = quantity

        await cart.save()

        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        })

        const populatecartItems = validItems.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : 'Product not found',
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.productId.quantity,
        }))

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                item: populatecartItems
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Errorrr add to cart'
        })
    }
}

export async function deleteCartItems(req, res) {
    try {

        const { userId, productId } = req.params

        if (!userId || !productId || !quantity <= 0) {
            res.status(400).json({
                success: false,
                message: 'Errorrr invalid data provided'
            })
        }

        const cart = await CartModel.findOne({ userId })
            .populate({
                path: 'item.productId',
                select: 'Image title price salePrice'
            })

        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'Cart not Found...'
            })
        }

        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId)

        await cart.save()

        await CartModel.populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        })

        const populatecartItems = validItems.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : 'Product not found',
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.productId.quantity,
        }))

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                item: populatecartItems
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Errorrr add to cart'
        })
    }
}