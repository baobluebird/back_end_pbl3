const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try { 
        const userId = req.params.id
        const {fullName , addressUser, email, phone, noteUser, shippingMethod, addressShipping, cityShipping, addressShop, cityShop, noteShipping} = req.body
        if(shippingMethod === "nhan tai cua hang"){
            if (!fullName || !addressUser || !email || !phone || !shippingMethod ||!addressShop ||!cityShop) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
        }else{
            if (!fullName || !addressUser || !email || !phone || !shippingMethod || !addressShipping || !cityShipping ) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
        }
        const data = req.body;
        const response = await OrderService.createOrder(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const userId = req.body.userId
        const orderId= req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}