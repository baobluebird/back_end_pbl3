const CRUDPaymentService = require('../services/CRUDPaymentService');  
const getHomepage = async (req, res) => {
    try {
        let sortName = null;
        let sortType = null;
        let nameSort = "";

        if (req.query.sort && typeof req.query.sort === 'object') {
            sortName = req.query.sort[0];
            sortType = req.query.sort[1];
            nameSort = req.query.sort[2]
        }
        switch (nameSort){
            case 'method-asc':
                nameSort = 'Thanh toán khi nhận hàng';
                break;
            case 'method-desc':
                nameSort = 'Thanh toán bằng Paypal';
                break;
            case 'totalPrice-asc':
                nameSort = 'Tổng tiền thấp đến cao';
                break;
            case 'totalPrice-desc':
                nameSort = 'Tổng tiền cao đến thấp';
                break;
            default:
                break;
        }
        const listPayments = await CRUDPaymentService.getAllPayment(sortName, sortType, nameSort);
        return res.render('payment/homepagePayment.ejs', { listPayments: listPayments , nameSort: nameSort, count : listPayments.length});
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching users',
        });
    }
}

module.exports = {
    getHomepage,
}