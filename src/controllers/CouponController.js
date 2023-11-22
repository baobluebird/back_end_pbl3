const CouponService = require('../services/CouponService');  

const createCoupon = async (req, res) => {
    try {
    const { name,methodDiscount, description, dateStart, dateEnd, value } = req.body

    if (!name || !methodDiscount || !description || !dateStart || !dateEnd || !value) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is required'
        })
    }

    const response = await CouponService.createCoupon(req.body)
    return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const data = req.body;
        if(!couponId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CouponService.updateCoupon(couponId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        if(!couponId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CouponService.deleteCoupon(couponId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const getDetailCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;

        if(!couponId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await CouponService.getDetailCoupon(couponId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const getAllCoupon = async (req, res) => {
    try {
        const method = req.body;
        if(!method){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        console.log(method)
        const response = await CouponService.getAllCoupon(method)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getDetailCoupon,
    getAllCoupon
}