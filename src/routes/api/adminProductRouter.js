const express = require('express');
const router = express.Router();
const { getHomepage, getCreateProduct, getUpdatePage, postCreateProduct, postUpdateProduct, postDeleteProduct, postHandleRemoveProduct } = require('../../controllers/adminProductController');

router.get('/', getHomepage);

router.get('/create', getCreateProduct);

router.get('/update/:id', getUpdatePage);

router.post('/create-product', postCreateProduct);

router.post('/update-product', postUpdateProduct);

router.post('/delete-product/:id', postDeleteProduct);

router.post('/delete-product', postHandleRemoveProduct);

router.get('/sort', getHomepage);
module.exports = router; //export default router