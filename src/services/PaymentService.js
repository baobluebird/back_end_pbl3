const Payment = require('../models/PaymentModel');
const Order = require("../models/OrderModel")
const dotenv = require('dotenv');
dotenv.config();
const EmailService = require("../services/EmailService")

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { generalAccessToken } = require('./JwtService');

const createPayment = (id,newPayment) => {
    return new Promise(async (resolve, reject) => {
        const {delivery , paymentMethod, isPaid} =  newPayment;
        const idOrder = id;
        try{
            
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
                coupon: order.coupon,
                itemsPrice: order.itemsPrice,
                shippingPrice: order.shippingPrice,
                totalPrice: order.totalPrice,
                isPaid
            })
            await EmailService.sendEmailCreateOrder(order.email, order.orderItems, order, paymentMethod, delivery, isPaid)
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