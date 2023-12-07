const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: true,},
        content: { type: String, required: true },
        rate: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating