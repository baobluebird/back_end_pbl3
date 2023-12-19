const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,},
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
        shippingMethod: { type: String, required: true },
        delivery: { type: String },
        paymentMethod: { type: String, required: true },
        name : { type: String, required: true },
        email: { type: String },
        phone : { type: Number, required: true },
        coupon: {  
            idCouponPrice: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon',
            },
            idCouponShipping: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon',
            },
            couponShipping: { type: Number },
            couponPrice: { type: Number },
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        
        isPaid: { type: Boolean, default: false },
        //isDelivered: { type: Boolean, default: false },
        //deliveredAt: { type: Date },
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment