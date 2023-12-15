const CRUDPaymentService = require('../services/CRUDPaymentService');  
const getHomepage = async (req, res) => {
    try {
        const listPayments = await CRUDPaymentService.getAllPayment();
        return res.render('payment/homepagePayment.ejs', { listPayments: listPayments , count : listPayments.length});
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching users',
        });
    }
}

module.exports = {
    getHomepage,
}