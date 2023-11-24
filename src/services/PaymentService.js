const Payment = require('../models/PaymentModel');
const Order = require("../models/OrderModel")
const Coupon = require("../models/CouponModel")

const dotenv = require('dotenv');
dotenv.config();
const EmailService = require("../services/EmailService")

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { generalAccessToken } = require('./JwtService');

const createPayment = (id,newPayment) => {
    return new Promise(async (resolve, reject) => {
        const {delivery , paymentMethod, isPaid, idCoupon} =  newPayment;
        console.log('idCoupon', idCoupon);
        let valuePriceCoupon = 0;
        let valueShippingCoupon = 0;

        const idOrder = id;
        try{

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

            const order = await Order.findOne({_id:idOrder});
            if(!order){
                return resolve({
                    status: 'error',
                    message: 'Order not found'
                })
            }

            const checkPayment = await Payment.findOne({isPaid:isPaid});
            if(checkPayment){
                return resolve({
                    status: 'error',
                    message: 'Payment already exists'
                })
            }

            const createPayment = await Payment.create({
                user: order.user,  
                order: order._id,
                name: order.name,
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
                totalPrice: order.totalPrice - (order.totalPrice * valuePriceCoupon / 100) - valueShippingCoupon,
                isPaid
            })
            await EmailService.sendEmailCreateOrder(order.email, order.orderItems, order, paymentMethod, delivery, isPaid, createPayment)
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

            allPayment = await Payment.find({ _id: id });
            resolve({
                status: 'success',
                message: 'Get all payment successfully',
                data: allPayment
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
            const payment = await Order.find({
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



module.exports = {
    createPayment,
    getAllPaymentDetails,
    getPaymentDetails,
    // cancelPaymentDetails,
    // getAllPayment
}