const Payment = require('../models/PaymentModel')

const getAllPayment = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allPayment = await Payment.find();
                resolve(allPayment)
        }catch(error){
            reject(error) 
        }
    })
}

module.exports = {
    getAllPayment,
}