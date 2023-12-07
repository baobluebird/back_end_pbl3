const express = require('express');
const router = express.Router();
const RatingController = require('../../controllers/RatingController');
const { authMiddleware, authUserMiddleware} = require('../../middleware/authMiddleware');

router.post('/create/:id', RatingController.createRating);
// router.get('/get-all-rating/:id', RatingController.getAllPaymentDetails);
// router.get('/get-details-rating/:id', RatingController.getPaymentDetails);
// router.delete('/delete-rating/:id', RatingController.cancelPaymentDetails);
//router.get('/get-all-payment', PaymentController.getAllPayment);

module.exports = router;
