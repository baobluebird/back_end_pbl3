const Order = require('../models/OrderModel');
const dotenv = require('dotenv');
dotenv.config();

const getAllOrder = (sortName, sortType, nameSort) => {
    return new Promise(async (resolve, reject) => {
        try{
            let allOrder;
            if(nameSort === 'Nhận tại cửa hàng'){
                allOrder = await Order.find({
                    shippingMethod: 'nhan tai cua hang'
                });
            }else if(nameSort === 'Giao hàng tận nơi'){
                allOrder = await Order.find({
                    shippingMethod: 'giao hang tan noi'
                });
            }
            else if (sortName && sortType) {
                const objectSort = { [sortName]: sortType };
                allOrder = await Order.find().sort(objectSort);
            } else {
                allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 });
            }

            resolve(allOrder);
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

const getAllOrderManagement = () => {
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
    getAllOrder,
    getDetailsOrder,
    getAllOrderManagement
}