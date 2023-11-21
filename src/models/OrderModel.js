const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            new_price: { type: Number, required: true },
            old_price: { type: Number, required: true },
            discount: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],

    shippingAddress: {
        fullname: { type: String, required: true },
        addressShipping: { type: String, required: true },
        cityShipping: { type: String, required: true },
        noteShipping: { type: String },
        phone: { type: Number, required: true },
        shopAddress: { type: String },
        shopCity: { type: String },
    },
    email: { type: String },
    addressUser: { type: String, required: true },
    noteUser: { type: String },
    shippingMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice:{ type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // paymentMethod: { type: String, required: true },
    // isPaid: { type: Boolean, default: false },
    // paidAt: { type: Date },
    // isDelivered: { type: Boolean, default: false },
    // deliveredAt: { type: Date },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order