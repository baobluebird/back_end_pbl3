const CRUDLoginService = require('../services/CRUDLoginService');  
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const getHomeLogin = async (req, res) => {
    try {
        return res.render('login.ejs');
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching users',
        });
    }
}

const postLogin = async (req, res) => {
  try {
    const response = await CRUDLoginService.getLogin(req.body);
    if (response.status === 'success') {
      if (response.isAdmin) {
        return res.render('login.ejs', { access_token: response.access_token });
        // res.redirect('/admin/user/');
      } else {
        return res.render('login.ejs', { error: 'This user is not admin' });
      }
    } else {
      return res.render('login.ejs', { error: response.message });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const postLogout = async (req, res) => {
  try {
    res.redirect('/admin');
  } catch (error) { 
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const postAuth = async (req, res) => {
  const token = req.headers.token
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user){
      if(err){
          return res.status(404).json({
              status: 'ERR',
              message: 'Unauthorized'
          })
      }
      const  {payload} = user
      if(payload?.isAdmin){
          return res.status(200).json({
              status: 'OK',
              message: 'Authorized'
          })
      }else{
          return res.status(404).json({
              status: 'ERR',
              message: 'Unauthorized'
          })
      }
  });
};

module.exports = {
    getHomeLogin,
    postLogin,
    postLogout,
    postAuth
    
}