const Product = require("../models/ProductModel")
const User = require("../models/UserModel")
const Rating = require("../models/RatingModel")

const createRating = (userId,newRating) => {
    return new Promise(async (resolve, reject) => {
        const {productId , rate, content} =  newRating;
        try{
            const user = await User.findOne({ _id : userId});
            const product = await Product.findOne({_id : productId});
            if(!user || !product){
                return resolve({
                    status: 'error',
                    message: 'User or Product not found'
                })
            }
            
            const calculateTotalRating = (product.total_rate + rate)/2;
            await Product.findByIdAndUpdate(productId, {total_rate: calculateTotalRating});

            const newComment = {
                name: user.name,
                content,
                rate,
                user: userId 
            }
            await Product.findByIdAndUpdate(productId, { $push: { comments: newComment } });

            const createRating = await Rating.create({
                user: userId,
                product: productId,
                rate,
                content
            });

            if(createRating){
                resolve({
                    status: 'success',
                    message: 'Payment created successfully',
                    data: createRating
                })
            }
        }catch(error){
            reject(error)
        }
    })
}



module.exports = {
    createRating,
}   