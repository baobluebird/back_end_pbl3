const Coupon = require('../models/CouponModel');
const dotenv = require('dotenv');
dotenv.config();

const createCoupon = async (newCoupon) => {

        const {name, methodDiscount, description, dateStart, dateEnd, value} = newCoupon;

        try{        
            await Coupon.create({
                name, 
                methodDiscount, 
                description, 
                dateStart, 
                dateEnd, 
                value
            })
        }catch(error){
           return error
        }
}


const updateCoupon = async (id,data) => {
        try{
        await Coupon.findByIdAndUpdate(id,data, {new: true})
        }catch(error){
            return error
        }
}

const deleteCoupon = async (id) => {
    try{
     await Coupon.findByIdAndDelete(id)
    }
    catch(error){
        return error
    }
}

const getAllCoupon = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allCoupon = await Coupon.find()
                resolve(allCoupon)
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsCoupon = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const coupon = await Coupon.findOne({
                _id: id
            })

            if(coupon == null){
                resolve({
                    status: 'error',
                    message: 'The coupon is not exist'
                })
            }

            resolve(coupon)
        }catch(error){
            reject(error) 
        }
    })
}


const deleteManyCoupon = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Coupon.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete coupon success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupon,
    getDetailsCoupon,
    deleteManyCoupon
}