const Payment = require('../models/PaymentModel')

const getAllPayment = (sortName, sortType, nameSort) => {
    return new Promise(async (resolve, reject) => {
        try{
            let allPayment;
            if(nameSort === 'Thanh toán khi nhận hàng'){
                allPayment = await Payment.find({
                    paymentMethod: 'thanh toan khi nhan hang'
                });
            }else if(nameSort === 'Thanh toán bằng Paypal'){
                allPayment = await Payment.find({
                    paymentMethod: 'thanh toan bang paypal'
                });
            }
            else if (sortName && sortType) {
                const objectSort = { [sortName]: sortType };
                allPayment = await Payment.find().sort(objectSort);
            } else {
                allPayment = await Payment.find().sort({ createdAt: -1, updatedAt: -1 });
            }

            resolve(allPayment);
        }catch(error){
            reject(error) 
        }
    })
}

const getAllPaymentManagement = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allPayments = await Payment.find({}); // Lấy tất cả các thanh toán
            const paidPaymentsCount = allPayments.filter(payment => payment.isPaid === true).length;
            const unpaidPaymentsCount = allPayments.filter(payment => payment.isPaid === false).length;

            const result = {
                paidPayments: paidPaymentsCount,
                unpaidPayments: unpaidPaymentsCount,
            };
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getAllPayment,
    getAllPaymentManagement
}