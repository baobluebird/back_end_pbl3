const express = require('express');
const router = express.Router();
const { getHomepage, getCreateUser, getOrderUser, getPaymentUser, getUpdatePage, postCreateUser, postUpdateUser, postDeleteUser, postHandleRemoveUser } = require('../../controllers/adminUserController');
const { authMiddleware} = require('../../middleware/authMiddleware');

router.get('/', getHomepage);

router.get('/create', getCreateUser);

router.get('/order/:id', getOrderUser);

router.get('/payment/:id', getPaymentUser);

router.get('/update/:id', getUpdatePage);

router.post('/create-user', postCreateUser);

router.post('/update-user', postUpdateUser);

router.post('/delete-user/:id', postDeleteUser);

router.post('/delete-user', postHandleRemoveUser);

module.exports = router; //export default router