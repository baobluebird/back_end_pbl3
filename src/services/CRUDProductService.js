const Product = require('../models/ProductModel');
const dotenv = require('dotenv');
dotenv.config();


const createProduct = async (newProduct) => {

    const {name, description, new_price, old_price, image, type, countInStock, total_rate, discount, selled} = newProduct;

        try{
            const checkProduct = await Product.findOne({name:name});
            if(checkProduct){
                resolve({
                    status: 'error',
                    message: 'Name already exists'
                })
            }

            await Product.create({
                name, 
                description, 
                new_price, 
                old_price, 
                image, 
                type, 
                countInStock: Number(countInStock), 
                total_rate, 
                discount: Number(discount),
                selled
            })

        }catch(error){
           return error
        }
}


const updateProduct = async (id,data) => {
    console.log(id)
    console.log(data)
    try{
        await Product.findByIdAndUpdate(id,data, {new: true})
    }catch(error){
        return error
    }
}

const deleteProduct = async (id) => {
    try{
     await Product.findByIdAndDelete(id)
    }
    catch(error){
        return error
    }
}

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allProduct = await Product.find()
                resolve(allProduct)
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
                    message: 'The user is not exist'
                })
            }

            resolve(product)
        }catch(error){
            reject(error) 
        }
    })
}


const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailsProduct,
    deleteManyProduct
}