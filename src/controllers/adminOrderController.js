const CRUDOrderService = require('../services/CRUDOrderService');  

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
                nameSort = 'Nhận tại cửa hàng';
                break;
            case 'method-desc':
                nameSort = 'Giao hàng tận nơi';
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
        const listOrders = await CRUDOrderService.getAllOrder(sortName, sortType, nameSort);
        return res.render('order/homepageOrder.ejs', { listOrders: listOrders , nameSort: nameSort, count : listOrders.length});
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
        return res.render('order/orderDetails.ejs', { order: order , count : order.orderItems.length});
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching coupon',
        });
    }
}

const getAllOrderManagement = async (req, res) => {
    try {
        const allOrder = await CRUDOrderService.getAllOrderManagement();
        return res.render('order/orderManagement.ejs', { allOrder: allOrder , count : allOrder.length});
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
    getDetailsOrderAddress,
    getAllOrderManagement
}