const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');
const {  authUserMiddleware  } = require('../../middleware/authMiddleware');

router.post('/create-code', userController.createCode);
router.post('/check-code/:id', userController.checkCode);

router.post('/create-token', userController.createTokenEmail);
router.post('/check-token/:id', userController.checkTokenEmail);
module.exports = router; 