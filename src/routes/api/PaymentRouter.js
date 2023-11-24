const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/PaymentController');
const { authMiddleware, authUserMiddleware} = require('../../middleware/authMiddleware');

router.post('/create/:id', PaymentController.createPayment);
router.get('/get-all-payment/:id', PaymentController.getAllPaymentDetails);
router.get('/get-details-payment/:id', PaymentController.getPaymentDetails);
router.delete('/cancel-payment/:id', PaymentController.cancelPaymentDetails);
//router.get('/get-all-payment', PaymentController.getAllPayment);

module.exports = router;
