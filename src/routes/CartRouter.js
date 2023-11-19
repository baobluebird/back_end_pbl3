const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
//const { authMiddleware, authUserMiddleware} = require('../middleware/authMiddleware');

router.post('/add-to-cart', CartController.addToCart);
router.delete('/delete-item/:id', CartController.deleteItem);
// router.get('/get-details-order/:id', CartController.getDetailsOrder);
// router.delete('/cancel-order/:id',authUserMiddleware, CartController.cancelOrderDetails);
// router.get('/get-all-order',authMiddleware, CartController.getAllOrder);

module.exports = router;
