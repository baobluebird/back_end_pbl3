const CRUDUserService = require('../services/CRUDCouponService');  
const getHomepage = async (req, res) => {
    try {
        const listCoupons = await CRUDUserService.getAllCoupon();
        return res.render('coupon/homepageCoupon.ejs', { listCoupons: listCoupons });
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching coupon',
        });
    }
}

const postCreateCoupon = async (req, res) => {
    await CRUDUserService.createCoupon(req.body); 
    res.redirect('/admin/coupon/');
}

const getCreateCoupon= (req, res) => {
    res.render('coupon/createCoupon.ejs');
}

const getUpdatePage = async (req, res) => {

    const couponId = req.params.id;

    let coupon = await CRUDUserService.getDetailsCoupon(couponId);

    res.render('coupon/editCoupon.ejs', { couponEdit : coupon });
}

const postUpdateCoupon = async (req, res) => {
    const couponId = req.body.couponId;
    const data = req.body;

    await CRUDUserService.updateCoupon(couponId, data)

    res.redirect('/admin/coupon/');

}

const postDeleteCoupon = async (req, res) => {
    const couponId = req.params.id;
    let coupon = await CRUDUserService.getDetailsCoupon(couponId);

    res.render('coupon/deleteCoupon.ejs', { couponEdit : coupon });
}

const postHandleRemoveCoupon = async (req, res) => {
    const couponId = req.body.couponId;
    await CRUDUserService.deleteCoupon(couponId)
    
    return res.redirect('/admin/coupon/');
}

module.exports = {
    getHomepage,
    postCreateCoupon,
    getCreateCoupon,
    getUpdatePage,
    postUpdateCoupon,
    postDeleteCoupon,
    postHandleRemoveCoupon
}