const Payment = require('../models/PaymentModel');
const Order = require("../models/OrderModel")
const Coupon = require("../models/CouponModel")
const Cart = require("../models/CartModel")
const Product = require("../models/ProductModel")
const dotenv = require('dotenv');
dotenv.config();
const EmailService = require("../services/EmailService")

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { generalAccessToken } = require('./JwtService');

const createPayment = (id,newPayment) => {
    return new Promise(async (resolve, reject) => {
        const {delivery , paymentMethod, isPaid, idCoupon} =  newPayment;
        console.log('idCoupon',idCoupon)
        let valuePriceCoupon = 0;
        let valueShippingCoupon = 0;
        let CalculateTotalPrice = 0;
        let idPrice = null;
        let idShipping = null;
        try{

            for (const element of idCoupon) {
                const idCheck = await Coupon.findOne({_id: element});
                if (idCheck) {
                    if (idCheck.methodDiscount === 'price') {
                        idPrice = element;
                    } else {
                        idShipping = element;
                    }
                }
            }

            console.log('idPrice',idPrice)
            if(idPrice === null && idShipping === null){
                return resolve({
                    status: 'error',
                    message: 'Coupon not found'
                })
            }
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

            const order = await Order.findOne({_id:id});
            if(!order){
                return resolve({
                    status: 'error',
                    message: 'Order not found'
                })
            }

            const checkPayment = await Payment.findOne({order:id});
            if(checkPayment){
                return resolve({
                    status: 'error',
                    message: 'Payment already exists'
                })
            }

            if(order.shippingMethod === 'nhan tai cua hang'){
                CalculateTotalPrice = order.totalPrice - (order.totalPrice * valuePriceCoupon / 100)
            }else{
                CalculateTotalPrice = valueShippingCoupon === 30000 ? order.totalPrice - (order.totalPrice * valuePriceCoupon / 100) - valueShippingCoupon : order.totalPrice - (order.totalPrice * valuePriceCoupon / 100) + 30000
            }

            const createPayment = await Payment.create({
                user: order.user,  
                order: order._id,
                orderItems: order.orderItems,
                name: order.name,
                email: order.email,
                phone: order.phone,
                shippingMethod: order.shippingMethod,
                delivery,
                paymentMethod,
                coupon: {
                    couponShipping: valueShippingCoupon,
                    couponPrice: valuePriceCoupon
                },
                itemsPrice: order.itemsPrice,
                shippingPrice: (order.shippingMethod === 'nhan tai cua hang') ? 0 : (30000 - valueShippingCoupon),
                totalPrice: CalculateTotalPrice,
                isPaid
            })
            await EmailService.sendEmailCreateOrder(order, paymentMethod, delivery, isPaid, createPayment)
            if(createPayment){
                resolve({
                    status: 'success',
                    message: 'Payment created successfully',
                    data: createPayment
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const getPaymentDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const payment = await Payment.find({ _id: id });
            resolve({
                status: 'success',
                message: 'Get all payment successfully',
                data: payment
            });
        } catch (error) {
            console.error('Error getting all coupons:', error);
            reject(error);
        }
    });
};

const getAllPaymentDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payment = await Payment.find({
                user: id
            }).sort({createdAt: -1, updatedAt: -1})
            if (payment === null) {
                resolve({
                    status: 'error',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'success',
                message: 'Get all payment by user successfully',
                data: payment
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelPaymentDetails = (paymentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payment = await Payment.findOne({ _id: paymentId });
            if(!payment){
                reject({
                    status:'error',
                    message:'This user dont have a cart'
                })
            }
            const orderItems = payment.orderItems


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
                    await Payment.findByIdAndDelete(paymentId)
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

module.exports = {
    createPayment,
    getAllPaymentDetails,
    getPaymentDetails,
    cancelPaymentDetails,
    // getAllPayment
}