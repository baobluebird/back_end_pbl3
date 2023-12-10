const express = require('express');
const router = express.Router();
const { getHomeLogin, postLogin,postLogout,postAuth } = require('../../controllers/adminLoginController');



router.get('/', getHomeLogin);

router.post('/login', postLogin);
router.get('/logout', postLogout);
router.post('/auth', postAuth);
// router.get('/logoutPage/:id', getLogoutPage);

// router.post('/logout', getLogout);

module.exports = router; //export default router