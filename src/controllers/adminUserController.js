const CRUDUserService = require('../services/CRUDUserService');  
const User = require('../models/UserModel');
const getHomepage = async (req, res) => {
    try {
        const listUsers = await CRUDUserService.getAllUser();
        return res.render('user/homepageUser.ejs', { listUsers: listUsers , count : listUsers.length});
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching users',
        });
    }
}

const postCreateUser = async (req, res) => {
    await CRUDUserService.createUser(req.body); 
    res.redirect('/admin/user/');
}

const getCreateUser = (req, res) => {
    res.render('user/createUser.ejs');
}

const getOrderUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }); 
    const listOrders = await CRUDUserService.getOrderUser(userId);
    return res.render('user/orderUser.ejs', { listOrders: listOrders , count : listOrders.length, nameUser : user.name});
}

const getPaymentUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }); 
    const listPayments = await CRUDUserService.getPaymentUser(userId);
    return res.render('user/paymentUser.ejs', { listPayments: listPayments , count : listPayments.length, nameUser : user.name});
}



const getUpdatePage = async (req, res) => {

    const userId = req.params.id;

    let user = await CRUDUserService.getDetailsUser(userId);

    res.render('user/editUser.ejs', { userEdit : user });//{userEdit : user} = {userEdit : results[0]}
}

const postUpdateUser = async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    await CRUDUserService.updateUser(userId, data)

    res.redirect('/admin/user/');

}

const postDeleteUser = async (req, res) => {
    const userId = req.params.id;
    let user = await CRUDUserService.getDetailsUser(userId);

    res.render('user/deleteUser.ejs', { userEdit : user });
}

const postHandleRemoveUser = async (req, res) => {
    const userId = req.body.userId;
    await CRUDUserService.deleteUser(userId)
    
    return res.redirect('/admin/user/');
}

module.exports = {
    getHomepage,
    postCreateUser,
    getCreateUser,
    getOrderUser,
    getUpdatePage,
    postUpdateUser,
    postDeleteUser,
    postHandleRemoveUser,
    getPaymentUser
}