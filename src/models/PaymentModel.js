const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,},
        shippingMethod: { type: String, required: true },
        delivery: { type: String },
        paymentMethod: { type: String, required: true },
        name : { type: String, required: true },
        phone : { type: Number, required: true },
        coupon: {  
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