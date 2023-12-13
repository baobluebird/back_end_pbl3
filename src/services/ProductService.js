const Product = require('../models/ProductModel');
const dotenv = require('dotenv');
dotenv.config();

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {name, description, new_price, old_price, image, type, countInStock, total_rate, selled} = newProduct

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
                total_rate, 
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

const searchProduct = (limit, page,searchName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allProduct;
            if (searchName) {
                console.log(searchName);
                const regex = new RegExp(searchName, 'i');
                allProduct = await Product.find({
                    $or: [
                        { name: { $regex: regex } },
                        { description: { $regex: regex } },
                        { type	: { $regex: regex } },
                    ]
                }).limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 });
                const totalProduct = await Product.countDocuments({
                    $or: [
                        { name: { $regex: regex } },
                        { description: { $regex: regex } },
                        { type	: { $regex: regex } },
                    ]
                });
                return resolve({
                    status: 'success',
                    message: 'Successfully get all product',
                    data: allProduct,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: limit === null ? 1 : Math.ceil(totalProduct / limit)
                });
            } else {
                allProduct = await Product.find().sort({ createdAt: -1, updatedAt: -1 });
            }
            return resolve({
                status: 'success',
                message: 'Successfully get all product',
                data: allProduct,
                total: allProduct.length,
                pageCurrent: Number(page + 1),
                totalPage: limit === null ? 1 : Math.ceil(allProduct.length / limit)
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllProduct = async (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
    try {
        const totalProduct = await Product.countDocuments();
        let allProduct;

        if (filter) {
            const label = filter[0];
            let filterValue;

            if (['new_price', 'old_price', 'countInStock', 'total_rate', 'selled'].includes(label)) {
                filterValue = parseInt(filter[1]);
            }

            const regex = new RegExp(filter[1], 'i'); 

            const filterQuery = filterValue
                ? { [label]: filterValue }
                : { [label]: { '$regex': regex } };

            allProduct = await Product.find(filterQuery).limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 });
            const length = await Product.countDocuments({
                $or: [
                    { [label]: { $regex: regex } },
                ]
            });
            return resolve({
                status: 'success',
                message: 'Successfully get all product',
                data: allProduct,
                total: length,
                pageCurrent: Number(page + 1),
                totalPage: limit === null ? 1 : Math.ceil(length / limit)
            });

        } else if (sort) {
            const objectSort = { [sort[1]]: sort[0] };
            allProduct = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
        } else if (!limit) {
            allProduct = await Product.find().sort({ createdAt: -1, updatedAt: -1 });
        } else {
            allProduct = await Product.find().limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 });
        }

        resolve({
            status: 'success',
            message: 'Successfully get all product',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit)
        });
    } catch (e) {
        reject(e);
    }
});
}

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
    getAllType,
    searchProduct
}