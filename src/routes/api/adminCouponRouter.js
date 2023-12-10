const express = require('express');
const router = express.Router();
const { getHomepage, getCreateCoupon, getUpdatePage, postCreateCoupon, postUpdateCoupon, postDeleteCoupon, postHandleRemoveCoupon } = require('../../controllers/adminCouponController');

router.get('/', getHomepage);

router.get('/create', getCreateCoupon);

router.get('/update/:id', getUpdatePage);

router.post('/create-coupon', postCreateCoupon);

router.post('/update-coupon', postUpdateCoupon);

router.post('/delete-coupon/:id', postDeleteCoupon);

router.post('/delete-coupon', postHandleRemoveCoupon);

module.exports = router; //export default router