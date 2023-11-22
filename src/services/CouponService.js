const Coupon = require('../models/CouponModel');

const createCoupon = (newCoupon) => {
    return new Promise(async (resolve, reject) => {
        const { name,methodDiscount,description, dateStart, dateEnd, value } = newCoupon;

        try{
            const checkCoupon = await Coupon.findOne({name:name});
            if(checkCoupon){
                resolve({
                    status: 'error',
                    message: 'Coupon already exists'
                })
            }
            
            const createCoupon = await Coupon.create({
                name,  
                methodDiscount,
                description,
                dateStart,
                dateEnd,
                value
            })
            if(createCoupon){
                resolve({
                    status: 'success',
                    message: 'Coupon created successfully',
                    data: createCoupon
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const updateCoupon = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkCoupon = await Coupon.findOne({
                _id:id
            })

            if(checkCoupon == null){
                resolve({
                    status: 'error',
                    message: 'The product is not exist'
                })
            }

            const updatedCoupon = await Coupon.findByIdAndUpdate(id,data, {new: true})
                resolve({
                    status: 'success',
                    message: 'Coupon update successfully',
                    data: updatedCoupon
                })
        }catch(error){
            reject(error) 
        }
    })
}

const deleteCoupon = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkCoupon = await Coupon.findOne({
                _id:id
            })

            if(checkCoupon == null){
                resolve({
                    status: 'error',
                    message: 'The coupon is not exist'
                })
            }

            await Coupon.findByIdAndDelete(id)
                resolve({
                    status: 'success',
                    message: 'Coupon delete successfully',
                })
        }catch(error){
            reject(error) 
        }
    })
}


const getDetailCoupon = (id) => {
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

            resolve({
                status: 'success',
                message: 'Get detail coupon id:' + id +  ' successfully',
                data: coupon
            })
        }catch(error){
            reject(error) 
        }
    })
}

const getAllCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allCoupon;
            if (data.method === "nhan tai cua hang") {
                allCoupon = await Coupon.find({ methodDiscount: "price" });
            } else {
                allCoupon = await Coupon.find();
            }

            resolve({
                status: 'success',
                message: 'Get all coupons successfully',
                data: allCoupon
            });
        } catch (error) {
            console.error('Error getting all coupons:', error);
            reject(error);
        }
    });
};

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getDetailCoupon,
    getAllCoupon
}