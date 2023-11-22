const Product = require('../models/ProductModel');
const dotenv = require('dotenv');
dotenv.config();

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {name, description, new_price, old_price, image, type, countInStock, rating, selled} = newProduct

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
                countInStock: Number(countInStock), 
                rating, 
                selled
            })

            if(newProduct){
                resolve({
                    status: 'success',
                    message: 'Product created successfully',
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

const searchProduct = (name) => {
    return new Promise(async (resolve, reject) => {
        try{
            const product = await Product.find({
                name: name
            })

            if(product == null){
                resolve({
                    status: 'error',
                    message: 'The product is not exist'
                })
            }

            resolve({
                status: 'success',
                message: 'Get detail product name:' + name +  ' successfully',
                data: product
            })
        }catch(error){
            reject(error) 
        }
    })
}

const getAllProduct = async (limit, page, sort, filter) => {
    try {
        const totalProduct = await Product.countDocuments();
        let allProduct;

        if (filter) {
            const label = filter[0];
            let filterValue;

            if (['new_price', 'old_price', 'countInStock', 'rating', 'selled'].includes(label)) {
                filterValue = parseInt(filter[1]);
            }

            const filterQuery = filterValue
                ? { [label]: filterValue }
                : { [label]: { '$regex': filter[1] } };

            allProduct = await Product.find(filterQuery).limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 });
        } else if (sort) {
            const objectSort = { [sort[1]]: sort[0] };
            allProduct = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
        } else if (!limit) {
            allProduct = await Product.find().sort({ createdAt: -1, updatedAt: -1 });
        } else {
            allProduct = await Product.find().limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 });
        }

        return {
            status: 'success',
            message: 'Successfully get all product',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit)
        };
    } catch (e) {
        throw e;
    }
};


const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'success',
                message: 'Successfully get all type product',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType
}