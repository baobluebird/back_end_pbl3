const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
//const { authMiddleware, authUserMiddleware} = require('../middleware/authMiddleware');

router.post('/add-to-cart', CartController.addToCart);
router.delete('/delete-item', CartController.removeItemFromCart);
router.get('/get-details-cart/:id', CartController.getDetailsCart);
// router.get('/get-details-order/:id', CartController.getDetailsOrder);
// router.delete('/cancel-order/:id',authUserMiddleware, CartController.cancelOrderDetails);
// router.get('/get-all-order',authMiddleware, CartController.getAllOrder);

module.exports = router;
