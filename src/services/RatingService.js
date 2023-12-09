const Product = require("../models/ProductModel")
const User = require("../models/UserModel")
const Rating = require("../models/RatingModel")

const createRating = (userId, newRating) => {
    return new Promise(async (resolve, reject) => {
      const { productId, rate, content } = newRating;
      try {
        const user = await User.findOne({ _id: userId });
        const product = await Product.findOne({ _id: productId });
        if (!user || !product) {
          return resolve({
            status: 'error',
            message: 'User or Product not found'
          });
        }
  
        const existingRating = await Rating.findOne({
          user: userId,
          product: productId
        });
  
        if (existingRating) {
          return resolve({
            status: 'error',
            message: 'User has already rated this product'
          });
        }
  
        const createRating = await Rating.create({
          user: userId,
          product: productId,
          rate,
          content
        });
  
        if (!createRating) {
          return resolve({
            status: 'error',
            message: 'Cannot create rating'
          });
        }
  
        const newComment = {
          name: user.name,
          content,
          rate,
          user: userId,
          rating_id: createRating._id,
          time_create: createRating.createdAt
        };
  
        await Product.findByIdAndUpdate(productId, { $push: { comments: newComment } });
  
        const updatedProduct = await Product.findById(productId);
  
        let averageRating = updatedProduct.calculateAverageRating();
  
        averageRating = Math.round(averageRating * 10) / 10;
  
        await Product.findByIdAndUpdate(productId, { total_rate: averageRating });
  
        resolve({
          status: 'success',
          message: 'Rating created successfully',
          data: createRating
        });
      } catch (error) {
        reject(error);
      }
    });
  };
    
  const deleteRating = (ratingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rating = await Rating.findOne({ _id: ratingId });
  
        await Product.findOneAndUpdate(
          { comments: { $elemMatch: { rating_id: ratingId } } },
          { $pull: { comments: { rating_id: ratingId } } }
        );

        await Rating.findByIdAndDelete(ratingId);
        const product = await Product.findOne({ _id: rating.product });
        let averageRating = product.calculateAverageRating();
        averageRating = Math.round(averageRating * 10) / 10;
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          { total_rate: averageRating }, 
          { new: true } 
        );
  
        resolve({
          status: 'success',
          message: 'Rating deleted successfully',
          data: updatedProduct,
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const updateRating = (ratingId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { rate, content } = data;
        const rating = await Rating.findOne({ _id: ratingId });
        const product = await Product.findOne({ _id: rating.product });

        await Rating.findByIdAndUpdate(ratingId, data);
  
        await Product.findOneAndUpdate(
          { _id: product._id, "comments.rating_id": ratingId },
          {
            $set: {
              "comments.$.rate": rate,
              "comments.$.content": content,
              "comments.$.time_create": new Date(), 
            },
          },
          { new: true } 
        );
        
        const updateTotalRate = await Product.findOne({ _id: rating.product });

        let averageRating = updateTotalRate.calculateAverageRating();
  
        averageRating = Math.round(averageRating * 10) / 10;
  
        const updated = await Product.findByIdAndUpdate(
          product._id,
          { total_rate: averageRating }, 
          { new: true } 
        );
  
        resolve({
          status: 'success',
          message: 'Rating updated successfully',
          data: updated,
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  
  

module.exports = {
    createRating,
    deleteRating,
    updateRating
}   