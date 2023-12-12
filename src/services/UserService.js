const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const EmailService = require("../services/EmailService")
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generalAccessToken } = require('./JwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone} = newUser;

        try{
            const checkUser = await User.findOne({email:email});
            if(checkUser){
                return resolve({
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
                phone
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
                return resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }
            const comparePassword = await bcrypt.compareSync(password, checkUser.password);
            if(!comparePassword){
                return resolve({
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

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            const checkEmail = await User.findOne({ email: data.email });

            if (checkEmail) {
                return resolve({
                    status: 'error',
                    message: 'Email already exists',
                });
            }

            if (!checkUser) {
                return resolve({
                    status: 'error',
                    message: 'The user is not exist',
                });
            }

            if (data.password && data.oldPassword) {
                if (data.password === data.oldPassword) {
                    return reject({
                        status: 'error',
                        message: 'The new password must be different from the old password',
                    });
                }

                const comparePassword = await bcrypt.compare(data.oldPassword, checkUser.password);

                if (!comparePassword) {
                    return reject({
                        status: 'error',
                        message: 'The old password is incorrect',
                    });
                }

                const hashPassword = await bcrypt.hash(data.password, 10);
                data.password = hashPassword;
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            reject(error);
        }
    });
};


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

const createCode = (email) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await User.findOne({
                email: email
            })

            if(user == null){
                resolve({
                    status: 'error',
                    message: 'The email is not exist'
                })
            }

            const code = Math.floor(Math.random() * 1000000)

            await EmailService.sendEmailForgotPass(email, code)

            const checkCode = await Code.findOne({
                user: user._id,
            })

            if(checkCode){
                const createCode = await Code.findOneAndUpdate({
                    user: user._id,
                },{
                    code: code
                })
                if(createCode){
                    resolve({
                        status: 'success',
                        message: 'Create code successfully',
                        data: {
                            user: user.user,
                            id: createCode._id,
                            name: "Forgot password",
                        }
                    })
                }
            }else{
                const createCode = await Code.create({
                    user: user._id,
                    name: "Forgot password",
                    code: code
                })
    
                if(createCode){
                    resolve({
                        status: 'success',
                        message: 'Create code successfully',
                        data: {
                            user: user.user,
                            id: createCode._id,
                            name: "Forgot password",
                        }
                    })
                }
            }
        }catch(error){
            reject(error) 
        }
    })
}

const checkCode = (id, code) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkCode = await Code.findOne({
                _id: id,
                code: code
            })

            if(checkCode == null){
                resolve({
                    status: 'error',
                    message: 'The code is not exist'
                })
            }

            resolve({
                status: 'success',
                message: 'Check code successfully',
                data: {
                    user: checkCode.user,
                    id: checkCode._id,
                    name: "Forgot password",
                }
            })
        }catch(error){
            reject(error) 
        }
    })
}

const createTokenEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkEmail = await User.findOne({
                email: email
            })

            if(checkEmail == null){
                resolve({
                    status: 'error',
                    message: 'The email is not exist'
                })
            }

            const access_token = await generalAccessToken({
                id: checkEmail._id, 
                isAuth : true
            });

            const sendToken = await EmailService.sendEmailAuth(email, access_token)

            if(sendToken){
                resolve({
                    status: 'success',
                    message: 'Send token to email successfully',
                    data: checkEmail
                })
            }

        }catch(error){
            reject(error) 
        }
    })
}

const checkTokenEmail = (token) => {
    return new Promise(async (resolve, reject) => {
        try{
            jwt.verify(token, process.env.ACCESS_TOKEN, async(err, user) =>{
                if(err){
                    resolve({
                        status: 'error',
                        message: 'Unauthorized'
                    })
                }
                const checkUser = await User.findOne({
                    _id: user.id
                })

                if(checkUser == null){
                    resolve({
                        status: 'error',
                        message: 'The user is not exist'
                    })
                }

                if(user.isAuth == false){
                    resolve({
                        status: 'error',
                        message: 'The user is not authenticated'
                    })
                }else{
                    const data = await User.findByIdAndUpdate(user.id, {isAuth: true})
                    resolve({
                        status: 'success',
                        message: 'Email is authenticated',
                        data: data
                    })
                }
            })
        }catch(error){
            reject(error) 
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
    getDetailsUserWithCart,
    createCode,
    checkCode,
    createTokenEmail,
    checkTokenEmail
}