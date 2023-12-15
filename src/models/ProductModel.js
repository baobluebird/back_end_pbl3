const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { 
            name_description: { type: String, required: true },
            product_code: { type: String, required: true },
            product_type: { type: String, required: true },
            connection: { type: String, required: true },
            switch_type: { type: String, required: true },
            durability: { type: String, required: true },
            format: { type: String, required: true },
        },
        guarantee: { type: String, required: true },
        new_price: { type: Number, required: true },
        old_price: { type: Number, required: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        countInStock: { type: Number, required: true },
        sold: { type: Number },
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
                time_create: { type: Date, required: true },
            },
        ],
        
    },
    {
        timestamps: true,
    }
);
productSchema.methods.calculateAverageRating = function () {
    let totalRate = 0;
  
    this.comments.forEach((comment) => {
      totalRate += comment.rate;
    });
  
    const averageRate = this.comments.length > 0 ? totalRate / this.comments.length : 0;
  
    return averageRate;
  };
  const Product = mongoose.model('Product', productSchema);
  
  module.exports = Product;