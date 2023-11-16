const express = require('express');
const router = express.Router();
const OderController = require('../controllers/OrderController');
const { authMiddleware, authUserMiddleware} = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, OrderController.createOder);
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderDetails);
router.get('/get-details-order/:id', OrderController.getDetailsOder);
router.delete('/cancel-order/:id',authUserMiddleware, OrderController.cancelOrderDetails);
router.get('/get-all-order',authMiddleware, OrderController.getAllOder);

module.exports = router;
