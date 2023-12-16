const express = require('express');
const router = express.Router();
const { getHomepage} = require('../../controllers/adminPaymentController');

router.get('/', getHomepage);

router.get('/sort', getHomepage);

module.exports = router;