const Coupon = require('../models/CouponModel');
const Order = require('../models/OrderModel');
const createCoupon = (newCoupon) => {
    return new Promise(async (resolve, reject) => {
        const { name,methodDiscount,description, dateStart, dateEnd, value } = newCoupon;

        try{
            const checkCoupon = await Coupon.findOne({name:name});
            if(checkCoupon){
                return resolve({
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
                value,
                image
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
                return resolve({
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
                return resolve({
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
            if (data === "store") {
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

const increaseCoupon = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let valuePriceCoupon = 0;
            let valueShippingCoupon = 0;
            const { idPrice, idShipping } = data;
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
            let total_price = 0;
            if(valuePriceCoupon){
                total_price = order.totalPrice - (order.totalPrice * valuePriceCoupon / 100)
            }
            if(valueShippingCoupon){
                total_price = order.totalPrice - (order.totalPrice * valuePriceCoupon / 100) - valueShippingCoupon
            }
            
            resolve({
                status: 'success',
                message: 'Calculate coupon successfully',
                data: {
                    old_total_price: order.totalPrice,
                    total_price: total_price,
                    idPrice: idPrice,
                    valuePriceCoupon: valuePriceCoupon,
                    idShipping: idShipping,
                    valueShippingCoupon: valueShippingCoupon
                }
            });
        } catch (error) {
            console.error('Error getting all coupons:', error);
            reject(error);
        }
    });

}

const decreaseCoupon = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('id',id)
            console.log('data',data)
            let total = 0;
            let idPrice = null;
            let valuePriceCoupon = 0;
            let idShipping = null;
            let valueShippingCoupon = 0;
           if(data.idPrice && data.idShipping){
                if(id === data.idPrice){
                    total = data.old_total_price - data.valueShippingCoupon
                    idShipping = data.idShipping
                    valueShippingCoupon = data.valueShippingCoupon
                }
                if(id === data.idShipping){
                    total = data.old_total_price - (data.old_total_price * data.valuePriceCoupon / 100)
                    idPrice = data.idPrice
                    valuePriceCoupon = data.valuePriceCoupon
                }
           }else if(data.idPrice){
                total = data.old_total_price
           }else if(data.idShipping){
                total = data.old_total_price
           }
            resolve({
                status: 'success',
                message: 'Calculate coupon successfully',
                data: {
                    old_total_price: data.old_total_price,
                    total_price: total,
                    idPrice: idPrice,
                    valuePriceCoupon: valuePriceCoupon,
                    idShipping: idShipping,
                    valueShippingCoupon: valueShippingCoupon
                }
            });
        } catch (error) {
            console.error('Error getting all coupons:', error);
            reject(error);
        }
    })
}
module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getDetailCoupon,
    getAllCoupon,
    increaseCoupon,
    decreaseCoupon
}