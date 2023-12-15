const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/PaymentController');
const { authMiddleware, authUserMiddleware} = require('../../middleware/authMiddleware');
const dotenv = require('dotenv');
dotenv.config()

router.post('/create/:id', PaymentController.createPayment);
router.get('/get-all-payment/:id', PaymentController.getAllPaymentDetails);
router.get('/get-details-payment/:id', PaymentController.getPaymentDetails);
router.delete('/cancel-payment/:id', PaymentController.cancelPaymentDetails);
//router.get('/get-all-payment', PaymentController.getAllPayment);
router.get('/config', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    data: process.env.CLIENT_ID
  })
})

module.exports = router;
