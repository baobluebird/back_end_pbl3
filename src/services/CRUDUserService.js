const User = require('../models/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const { generalAccessToken } = require('./JwtService');

const createUser = async (newUser) => {

        const {name, email, password, confirmPassword, phone} = newUser;

        try{
            const checkUser = await User.findOne({email:email});
            if(checkUser){
                resolve({
                    status: 'error',
                    message: 'Email already exists'
                })
            }
            const hashPassword = await bcrypt.hash(password, 10);
            await User.create({
                name,  
                email,
                password: hashPassword,
                confirmPassword: hashPassword,
                phone
            })

        }catch(error){
           return error
        }
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

const updateUser = async (id,data) => {
        try{
        await User.findByIdAndUpdate(id,data, {new: true})
        }catch(error){
            return error
        }
}

const deleteUser = async (id) => {
    try{
     await User.findByIdAndDelete(id)
    }
    catch(error){
        return error
    }
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allUser = await User.find()
                resolve(allUser)
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

            resolve(user)
        }catch(error){
            reject(error) 
        }
    })
}


const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
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
    deleteManyUser
}