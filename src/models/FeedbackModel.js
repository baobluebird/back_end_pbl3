const mongoose = require('mongoose')

const feedBackSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: true,},
        name: { type: String },
        methodDiscount: { type: String },
        description: { type: String },
        dateStart: { type: String },
        dateEnd: { type: String },
        value: { type: Number },
        image: { type: String },
    },
    {
        timestamps: true
    }
);

const FeedBack = mongoose.model('FeedBack', feedBackSchema);
module.exports = Coupon