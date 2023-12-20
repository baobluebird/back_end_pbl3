const express = require('express');
const router = express.Router();
const { getHomepage, getAllOrderManagementByYear, getDetailsOrderItems, getDetailsOrderAddress, getAllOrderManagement} = require('../../controllers/adminOrderController');

router.get('/', getHomepage);

router.get('/details/:id', getDetailsOrderItems);

router.get('/sort', getHomepage);

router.get('/details-payment/:id', getHomepage);

router.get('/all-order', getAllOrderManagement);

router.get('/all-order-by-year', getAllOrderManagementByYear);
// router.post('/create-coupon', postCreateCoupon);

// router.post('/update-coupon', postUpdateCoupon);

// router.post('/delete-coupon/:id', postDeleteCoupon);

// router.post('/delete-coupon', postHandleRemoveCoupon);

module.exports = router; //export default router 