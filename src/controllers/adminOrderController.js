const CRUDOrderService = require('../services/CRUDOrderService');  

const getHomepage = async (req, res) => {
    try {
        const listOrders = await CRUDOrderService.getAllOrder();
        return res.render('order/homepageOrder.ejs', { listOrders: listOrders });
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching coupon',
        });
    }
}

const getDetailsOrderItems = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await CRUDOrderService.getDetailsOrder(orderId);
        return res.render('order/detailsIItems.ejs', { order: order });
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching coupon',
        });
    }
}

const getDetailsOrderAddress = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await CRUDOrderService.getDetailsOrder(orderId);
        return res.render('order/detailsAddress.ejs', { order: order });
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching coupon',
        });
    }
}

module.exports = {
    getHomepage,
    getDetailsOrderItems,
    getDetailsOrderAddress
}