const Order = require('../models/OrderModel');
const dotenv = require('dotenv');
dotenv.config();

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allOrder = await Order.find()
                resolve(allOrder)
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const order = await Order.findOne({
                _id: id
            })

            if(order == null){
                resolve({
                    status: 'error',
                    message: 'The order is not exist'
                })
            }

            resolve(order)
        }catch(error){
            reject(error) 
        }
    })
}

module.exports = {
    getAllOrder,
    getDetailsOrder
}