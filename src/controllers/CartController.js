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

const getDetailItemOrder = async (req, res) => {
    try {
      const name = req.params.name;
      if (!cartId) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Cart id not found.',
        });
      }
  
      const response = await CartService.getDetailItemOrder(cartId);
      return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
  };

const deleteItem = async (req, res) => {
    try {
      const itemId = req.params.id;
      if (!cartId) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Cart id not found.',
        });
      }
  
      const response = await CartService.deleteCart(itemId);
      return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
  };
module.exports = {
    addToCart,
    deleteItem,
}
