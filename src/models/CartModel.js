const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            new_price: { type: Number, required: true },
            old_price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],

    itemsPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

},
    {
        timestamps: true,
    }
);
const Cart = mongoose.model('Cart', orderSchema);
module.exports = Cart