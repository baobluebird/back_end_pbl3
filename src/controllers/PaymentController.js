const PaymentService = require('../services/PaymentService')

const createPayment = async (req, res) => {
    try { 
        const orderId = req.params.id
        const {delivery , paymentMethod, isPaid, idCoupon} = req.body
        if (!paymentMethod || isPaid === null ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const data = req.body;
        const response = await PaymentService.createPayment(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPaymentDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await PaymentService.getAllPaymentDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaymentDetails = async (req, res) => {
    try {
        const paymentId = req.params.id
        if (!paymentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await PaymentService.getPaymentDetails(paymentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelPaymentDetails = async (req, res) => {
    try {
        const paymentId= req.params.id
        if (!paymentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await PaymentService.cancelPaymentDetails(paymentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPriceAfterDiscount = async (req, res) => {
    try {
        const paymentId= req.params.id
        if (!paymentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await PaymentService.getPriceAfterDiscount(paymentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPayment = async (req, res) => {
    try {
        const data = await PaymentService.getAllPayment()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createPayment,
    getAllPaymentDetails,
    getPaymentDetails,
    cancelPaymentDetails,
    getAllPayment,
    getPriceAfterDiscount
}