const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        new_price: { type: Number, required: true },
        old_price: { type: Number, required: true },

        image: { type: String, required: true },
        type: { type: String, required: true },
        countInStock: { type: Number, required: true },
        selled: { type: Number },
        total_rate: { type: Number, required: true },
        comments: [
            {
                name: { type: String, required: true },
                content: { type: String, required: true },
                rate: { type: Number, required: true },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Rating',
                    required: true,
                },
            },
        ],
        
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;