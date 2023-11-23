const Order = require("../models/OrderModel")
const Product = require("../models/ProductModel")
const Cart = require("../models/CartModel")
const Coupon = require("../models/CouponModel")

const createOrder = (userId, newOrder) => {
    return new Promise(async (resolve, reject) => {

        const { fullName, addressUser, email, phone, noteUser, shippingMethod, addressShipping, cityShipping, addressShop, cityShop, noteShipping, idCoupon } = newOrder;
        console.log('idCoupon', idCoupon);
        let valuePriceCoupon = 0;
        let valueShippingCoupon = 0;

        try {
            const { idPrice, idShipping } = idCoupon;

            if (idPrice) {
                const couponData = await Coupon.findOne({ _id: idPrice });

                if (couponData) {
                    valuePriceCoupon = couponData.value;
                } else {
                    console.error(`Coupon not found for id: ${idPrice}`);
                }
            }

            if (idShipping) {
                const couponData = await Coupon.findOne({ _id: idShipping });

                if (couponData) {
                    valueShippingCoupon = couponData.value;
                } else {
                    console.error(`Coupon not found for id: ${idShipping}`);
                }
            }

            console.log('valuePriceCoupon', valuePriceCoupon / 100);
            console.log('valueShippingCoupon', valueShippingCoupon);

            const cart = await Cart.findOne({ user: userId });

            if (!cart) {
                reject({
                    status: 'error',
                    message: 'This user does not have a cart'
                });
            }

            const orderItems = cart.orderItems;

            if (orderItems.length === 0) {
                reject({
                    status: 'error',
                    message: 'This user does not have order items'
                });
            }

            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                );

                if (productData) {
                    return {
                        status: 'success',
                        message: 'SUCCESS'
                    };
                } else {
                    return {
                        status: 'error',
                        message: 'ERR',
                        id: order.product
                    };
                }
            });

            const results = await Promise.all(promises);
            const newData = results && results.filter((item) => item.id);

            if (newData.length) {
                const arrId = [];
                newData.forEach((item) => {
                    arrId.push(item.id);
                });

                resolve({
                    status: 'error',
                    message: `Product(s) with id(s): ${arrId.join(',')} do not have enough stock`
                });
            } else {
                const orderDetails = {
                    orderItems,
                    email,
                    name: fullName,
                    phone,
                    addressUser,
                    noteUser,
                    shippingMethod,
                    coupon: {
                        couponShipping: valueShippingCoupon,
                        couponPrice: valuePriceCoupon
                    },
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: (shippingMethod === 'nhan tai cua hang') ? 0 : (30000 - valueShippingCoupon),
                    totalPrice: cart.totalPrice - (cart.totalPrice * valuePriceCoupon / 100) - valueShippingCoupon,
                    user: cart.user
                };

                if (shippingMethod === 'nhan tai cua hang') {
                    orderDetails.shopAddress = {
                        fullName,
                        phone,
                        addressShop,
                        cityShop,
                        noteShipping
                    };
                } else {
                    orderDetails.shippingAddress = {
                        fullName,
                        phone,
                        addressShipping,
                        cityShipping,
                        noteShipping
                    };
                }

                const createdOrder = await Order.create(orderDetails);

                if (createdOrder) {
                    
                    resolve({
                        status: 'success',
                        message: 'Successfully create order',
                        itemsPrice: cart.itemsPrice,
                        coupon: `${valuePriceCoupon}%`,
                        shippingPrice: (shippingMethod === 'nhan tai cua hang') ? 0 : 30000 - valueShippingCoupon,
                        totalPrice: cart.totalPrice - (cart.totalPrice * valuePriceCoupon / 100) - valueShippingCoupon,
                    });
                }
            }
        } catch (e) {
            console.error('Error creating order:', e);
            reject(e);
        }
    });
};

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
                    status: 'error',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'success',
                message: 'Get all order by user successfully',
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
                    status: 'error',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'success',
                message: 'Get order detail successfully',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = (orderId, userId) => {
    return new Promise(async (resolve, reject) => {
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
                    selled: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    await Order.findByIdAndDelete(orderId)
                } else {
                    return{
                        status: 'OK',
                        message: 'ERR',
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
                message: 'successfully cancel order',
                //data: order
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