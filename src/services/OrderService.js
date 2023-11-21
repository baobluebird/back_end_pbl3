const Order = require("../models/OrderModel")
const Product = require("../models/ProductModel")
const Cart = require("../models/CartModel")
const EmailService = require("../services/EmailService")

const createOrder = (userId, newOrder) => {
    return new Promise(async (resolve, reject) => {

        const {fullname , addressUser, email, phone, noteUser, shippingMethod, addressShipping, cityShipping, noteShipping,shopAddress} = newOrder
        
        try {
            const cart = await Cart.findOne({ user: userId });
            if(!cart){
                reject({
                    status:'error',
                    message:'This user dont have a cart'
                })
            }
            const orderItems = cart.orderItems

            if(orderItems.length === 0){
                reject({
                    status:'error',
                    message:'This user have not oder items'
                })
            }
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    countInStock: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: -order.amount,
                        selled: +order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    return {
                        status: 'success',
                        message: 'SUCCESS'
                    }
                }
                 else {
                    return{
                        status: 'error',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            console.log('promises', promises)
            console.log('orderItems', orderItems)
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if(newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'error',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullname,
                        addressShipping,
                        cityShipping,
                        noteShipping,
                        phone,
                        shopAddress
                    },
                    email,
                    addressUser,
                    noteUser,
                    shippingMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: shopAddress ? 0 : 30000,
                    totalPrice: cart.totalPrice,
                    user: cart.user,
                })
                if (createdOrder) {
                    //await EmailService.sendEmailCreateOrder(email,orderItems)
                    resolve({
                        status: 'success',
                        message: 'Successfully create order',
                        itemsPrice: cart.itemsPrice,
                        shippingPrice:shopAddress ? 0 : 30000,
                        totalPrice: cart.totalPrice,
                    })
                }
            }
        } catch (e) {
        //   console.log('e', e)
            reject(e)
        }
    })
}

// const deleteManyProduct = (ids) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await Product.deleteMany({ _id: ids })
//             resolve({
//                 status: 'OK',
//                 message: 'Delete product success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({createdAt: -1, updatedAt: -1})
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    selled: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return{
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id
            
            if(newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}