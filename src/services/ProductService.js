const Product = require('../models/ProductModel');
const dotenv = require('dotenv');
dotenv.config();

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {name, description, new_price, old_price, image, type, countInStock, rating, discount, selled} = newProduct

        try{
            const checkProduct = await Product.findOne({
                name:name
            });

            if(checkProduct !== null){
                resolve({
                    status: 'error',
                    message: 'Name Product already exists'
                })
            }            

            const newProduct = await Product.create({
                name, 
                description, 
                new_price, 
                old_price, 
                image, 
                type, 
                countInStock, 
                rating, 
                discount, 
                selled
            })
            if(newProduct){
                resolve({
                    status: 'success',
                    message: 'User created successfully',
                    data: newProduct
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const updateProduct = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id:id
            })

            if(checkProduct == null){
                resolve({
                    status: 'error',
                    message: 'The product is not exist'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id,data, {new: true})
                resolve({
                    status: 'success',
                    message: 'Product update successfully',
                    data: updatedProduct
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const product = await Product.findOne({
                _id: id
            })

            if(product == null){
                resolve({
                    status: 'error',
                    message: 'The product is not exist'
                })
            }

            resolve({
                status: 'success',
                message: 'Get detail product id:' + id +  ' successfully',
                data: product
            })
        }catch(error){
            reject(error) 
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id:id
            })

            if(checkProduct == null){
                resolve({
                    status: 'error',
                    message: 'The product is not exist'
                })
            }

            await Product.findByIdAndDelete(id)
                resolve({
                    status: 'success',
                    message: 'Product delete successfully',
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getAllProduct = (limitProduct, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try{
            const totalProduct = await Product.countDocuments()
            if(filter){
                const label = filter[0]
                const allProductFilter = await Product.find({[label]:{ '$regex' : filter[1] }}).limit(limitProduct).skip(page * limitProduct)
                resolve({
                    status: 'success',
                    message: 'Get all product successfully',
                    data: allProductFilter,
                    total: totalProduct,
                    pagaCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct/limitProduct)
                })
            }

            if (sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                console.log('objectSort', objectSort)
                const allProductSort = await Product.find().limit(limitProduct).skip(page * limitProduct).sort(objectSort)

                resolve({
                    status: 'success',
                    message: 'Get all product successfully',
                    data: allProductSort,
                    total: totalProduct,
                    pagaCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct/limitProduct)
                })
            }
                const allProduct = await Product.find().limit(limitProduct).skip(page * limitProduct)

                resolve({
                    status: 'success',
                    message: 'Get all product successfully',
                    data: allProduct,
                    total: totalProduct,
                    pagaCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct/limitProduct)
                })
            
        }catch(error){
            reject(error) 
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}