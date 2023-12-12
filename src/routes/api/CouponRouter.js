const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/CouponController');

router.post('/create', couponController.createCoupon);
router.get('/get-detail/:id',couponController.getDetailCoupon);
router.get('/get-all/:method',couponController.getAllCoupon);
router.post('/increase/:id',couponController.increaseCoupon);
router.post('/decrease/:id',couponController.decreaseCoupon);
module.exports = router; 