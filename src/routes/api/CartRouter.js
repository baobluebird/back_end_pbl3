const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/CartController');
//const { authMiddleware, authUserMiddleware} = require('../middleware/authMiddleware');

router.post('/add-to-cart', CartController.addToCart);
router.delete('/decrease-amount/:id', CartController.decreaseAmountItemFromCart);
router.put('/increase-amount/:id', CartController.increaseAmountItemFromCart);
router.delete('/delete-item/:id', CartController.deleteItemFromCart);
router.get('/get-details-cart/:id', CartController.getDetailsCart);
router.delete('/delete-cart/:id', CartController.deleteCart);

// router.get('/get-details-order/:id', CartController.getDetailsOrder);
// router.delete('/cancel-order/:id',authUserMiddleware, CartController.cancelOrderDetails);
// router.get('/get-all-order',authMiddleware, CartController.getAllOrder);

module.exports = router;