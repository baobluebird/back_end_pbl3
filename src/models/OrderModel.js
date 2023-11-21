const mongoose = require('mongoose');

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
    shopAddress: {
        fullName: { type: String },
        phone: { type: Number},
        addressShop: { type: String },
        cityShop: { type: String },
        noteShipping: { type: String },
    },
    shippingAddress: {
        fullName: { type: String },
        phone: { type: Number},
        addressShipping: { type: String },
        cityShipping: { type: String },
        noteShipping: { type: String },
    },
    email: { type: String },
    addressUser: { type: String, required: true },
    noteUser: { type: String },
    shippingMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Additional fields (commented out in your code)
    // paymentMethod: { type: String, required: true },
    // isPaid: { type: Boolean, default: false },
    // paidAt: { type: Date },
    // isDelivered: { type: Boolean, default: false },
    // deliveredAt: { type: Date },
},
{
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
