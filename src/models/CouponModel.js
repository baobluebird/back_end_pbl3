const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
    {
        name: { type: String },
        methodDiscount: { type: String },
        description: { type: String },
        dateStart: { type: String },
        dateEnd: { type: String },
        value: { type: Number },
    },
    {
        timestamps: true
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon