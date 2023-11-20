const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
    try {
      const { newCart } = req.body;
      if (!newCart || !newCart.userID || !newCart.productID) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Invalid input. Please provide userID and productID.',
        });
      }
  
      const response = await CartService.addToCart(req.body);
      return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
  };

const getDetailsCart = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId)
      if (!userId) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Cart id not found.',
        });
      }
      const response = await CartService.getDetailsCart(userId);
      return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
  };

const removeItemFromCart = async (req, res) => {
    try {
      const cartId = req.params.id
      const itemId = req.body.itemId  
      if (!itemId) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Cart id item not found.',
        });
      }
      if (!cartId) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Cart id cart not found.',
        });
      }
  
      const response = await CartService.removeItemFromCart(itemId, cartId);
      return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
};

const addItemFromCart = async (req, res) => {
  try {
    const cartId = req.params.id
    const itemId = req.body.itemId  
    if (!itemId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Cart id item not found.',
      });
    }
    if (!cartId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Cart id cart not found.',
      });
    }

    const response = await CartService.addItemFromCart(itemId, cartId);
    return res.status(200).json(response);
  } catch (e) {
      return res.status(404).json({ 
          message: e
      })
  }
};

const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    console.log(cartId)
    if (!cartId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Cart id not found.',
      });
    }
    const response = await CartService.deleteCart(cartId);
    return res.status(200).json(response);
  } catch (e) {
      return res.status(404).json({ 
          message: e
      })
  }
};
module.exports = {
    addToCart,
    removeItemFromCart,
    addItemFromCart,
    getDetailsCart,
    deleteCart
}
 