const User = require('../models/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generalAccessToken } = require('./JwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone, address} = newUser;

        try{
            const checkUser = await User.findOne({email:email});
            if(checkUser){
                resolve({
                    status: 'error',
                    message: 'Email already exists'
                })
            }

            const hashPassword = await bcrypt.hash(password, 10);
            
            const createUser = await User.create({
                name,  
                email,
                password: hashPassword,
                confirmPassword: hashPassword,
                phone,
                address
            })
            if(createUser){
                resolve({
                    status: 'success',
                    message: 'User created successfully',
                    data: createUser
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password} = userLogin;

        try{
            const checkUser = await User.findOne({email:email});
            if(checkUser == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }
            const comparePassword = await bcrypt.compareSync(password, checkUser.password);
            if(!comparePassword){
                resolve({
                    status: 'error',
                    message: 'The password is incorrect'
                })
            }
            
            const access_token = await generalAccessToken({
                id: checkUser._id, 
                isAdmin : checkUser.isAdmin
            });

            // const refresh_token = await generalRefreshToken({
            //     id: checkUser._id, 
            //     isAdmin : checkUser.isAdmin
            // });

            resolve({
                status: 'success',
                message: 'User login successfully',
                access_token,
                //refresh_token
            })
        }catch(error){
            reject(error)
        }
    })
}

const updateUser = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({
                _id:id
            })

            if(checkUser == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }
            const hashPassword = await bcrypt.hash(data.password, 10);
            data.password = hashPassword;
            data.confirmPassword = hashPassword;

            if(data.password != data.confirmPassword){
                resolve({
                    status: 'error',
                    message: 'The password is not match confirmPassword'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id,data, {new: true})
                resolve({
                    status: 'success',
                    message: 'User update successfully',
                    data: updatedUser
                })
        }catch(error){
            reject(error) 
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({
                _id:id
            })

            if(checkUser == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }

            await User.findByIdAndDelete(id)
                resolve({
                    status: 'success',
                    message: 'User delete successfully',
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allUser = await User.find()
                resolve({
                    status: 'success',
                    message: 'Get all user successfully',
                    data: allUser
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await User.findOne({
                _id: id
            })

            if(user == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }

            resolve({
                status: 'success',
                message: 'Get detail user id:' + id +  ' successfully',
                data: user
            })
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsUserWithCart = async (id) => {
    try {
        const userWithCarts = await User.findById(id).populate({
            path: 'carts',
            populate: {
                path: 'orderItems.product',
                model: 'Product'
            }
        });

        if (!userWithCarts) {
            return {
                status: 'error',
                message: 'The user does not exist',
            };
        }

        return {
            status: 'success',
            message: `Get detail user id: ${id} successfully`,
            data: userWithCarts.carts,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'An error occurred while fetching user details',
            error: error.message,
        };
    }
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'success',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    getDetailsUserWithCart
}