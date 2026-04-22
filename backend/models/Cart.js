import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },

            quantity: {
                type: Number,
                require: true,
                min: 1,
            },
        }
    ]
}, { timestamps: true })


export const CartModel = mongoose.model('Cart', CartSchema)