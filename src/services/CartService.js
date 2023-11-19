const { resolve } = require("path");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const addToCart = ({ newCart }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userID, productID } = newCart;

            const user = await User.findById(userID);
            const product = await Product.findById(productID);

            if (!user) {
                reject({
                    status: 'error',
                    message: 'Not found user'
                });
                return;
            }

            if (!product) {
                reject({
                    status: 'error',
                    message: 'Not found product'
                });
                return;
            }

            const itemPrice = product.new_price;
            const itemDiscount = product.discount;
            const itemTotalPrice = itemPrice - (itemPrice * itemDiscount) / 100;
            const orderItem = {
                name: product.name,
                amount: 1,
                image: product.image,
                price: product.new_price,
                discount: product.discount,
                product: productID,
            };

            let userOrder = await Cart.findOne({ user: userID });

            if (!userOrder) {
                userOrder = new Cart({
                    orderItems: [orderItem],
                    itemsPrice: itemPrice,
                    totalPrice: itemTotalPrice,
                    totalItems: 1,
                    user: userID,
                });
            } else {
                const existingItem = userOrder.orderItems.find(
                    (item) => item.product.toString() === productID
                );

                if (existingItem) {
                    existingItem.amount += 1;
                } else {
                    userOrder.orderItems.push(orderItem);
                }
                userOrder.totalItems += 1;
                userOrder.itemsPrice += itemPrice;
                userOrder.totalPrice += itemTotalPrice;
            }

            await userOrder.save();

            resolve({
                status: "success",
                message: "Item added to the cart successfully",
                data: userOrder,
            });
        } catch (error) {
            reject(error);
        }
    });
};


const removeItemFromCart = async (itemId, cartId) => {
    console.log("cartId", cartId);
    console.log("itemId", itemId);
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        {
          $pull: { orderItems: { _id: itemId } },
        },
        { new: true }
      );
  
      if (!updatedCart) {
        console.log("Cart not found");
        return {
            status: "error",
            message: "Cart not found",
        };
      }
  
      console.log("Item removed from cart:", updatedCart);
      return {
        status: "success",
        message: "Item removed from cart successfully",
        updatedCart
    };
    } catch (e) {
        throw e;
    }
  };


const getDetailsCart = (id) => {
return new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findOne({user : id});
        if (cart==null) {
            resolve({
                status: 'error',
                message: 'Not found user or product'
            })
        }
        console.log('cart',cart)
        resolve ({
            status: "success",
            message: "Cart details",
            data: cart
        });
    } catch (error) {
        reject(error)
    }
    })
}
module.exports = {
    addToCart,
    removeItemFromCart,
    getDetailsCart
};
