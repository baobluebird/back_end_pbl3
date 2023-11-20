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
                new_price: product.new_price,
                price: product.new_price,
                old_price: product.old_price,
                discount: product.discount,
                product: product._id,
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


const decreaseAmountItemFromCart = async (cartId, productId) => {
    return new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            reject({
                status: "error",
                message: "Cart not found",
            });
        }

        const itemIndex = cart.orderItems.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            reject({
                status: "error",
                message: "Item not found in the cart",
            });
        }

        if (cart.orderItems[itemIndex].amount > 1) {
            cart.orderItems[itemIndex].amount -= 1;
        } else {
            cart.orderItems.splice(itemIndex, 1);
        }

        cart.totalItems = cart.orderItems.reduce((total, item) => total + item.amount, 0);
        cart.itemsPrice = cart.orderItems.reduce((total, item) => total + item.new_price * item.amount, 0);

        cart.totalPrice = cart.orderItems.reduce((total, item) => {
            const itemTotalPrice = item.new_price * item.amount * ((100 - item.discount) / 100);
            return isNaN(itemTotalPrice) ? total : total + itemTotalPrice;
        }, 0);

        await cart.save();

        resolve({
            status: "success",
            message: "Item removed from cart successfully",
            updatedCart: cart,
        });
    } catch (error) {
        reject(error)
    }
    });
};

const increaseAmountItemFromCart = async (cartId, productId) => {
    return new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            reject({
                status: "error",
                message: "Cart not found",
            });
        }

        const itemIndex = cart.orderItems.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            reject({
                status: "error",
                message: "Item not found in the cart",
            });
        }

        cart.orderItems[itemIndex].amount += 1;
        cart.totalItems = cart.orderItems.reduce((total, item) => total + item.amount, 0);
        cart.itemsPrice = cart.orderItems.reduce((total, item) => total + item.new_price * item.amount, 0);

        cart.totalPrice = cart.orderItems.reduce((total, item) => {
            const itemTotalPrice = item.new_price * item.amount * ((100 - item.discount) / 100);
            return isNaN(itemTotalPrice) ? total : total + itemTotalPrice;
        }, 0);

        await cart.save();

        resolve({
            status: "success",
            message: "Item removed from cart successfully",
            updatedCart: cart,
        });
    } catch (error) {
        reject(error)
    }
    });
};

const deleteItemFromCart = async (cartId, productId) => {
    return new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findById(cartId);
        const itemIndex = cart.orderItems.findIndex(item => item.product.toString() === productId);
        console.log('itemIndex',itemIndex)
        if (itemIndex === -1) {
            reject({
                status: "error",
                message: "Product not found in the cart",
            });
        }
        cart.orderItems.splice(itemIndex, 1);

        cart.totalItems = cart.orderItems.reduce((total, item) => total + item.amount, 0);
        cart.itemsPrice = cart.orderItems.reduce((total, item) => total + item.new_price * item.amount, 0);
        cart.totalPrice = cart.orderItems.reduce((total, item) => {
            const itemTotalPrice = item.new_price * item.amount * ((100 - item.discount) / 100);
            return isNaN(itemTotalPrice) ? total : total + itemTotalPrice;
        }, 0);
        await cart.save();
        resolve({ 
            status: "success",
            message: "Item removed from cart successfully",
            updatedCart: cart,
        });
    } catch (error) {
        reject(error)
    }
});
}


const getDetailsCart = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ user: id });

            if (!cart) {
                resolve({
                    status: 'error',
                    message: 'User does not have a cart',
                });
                return;
            }

            if (!cart.orderItems || cart.orderItems.length === 0) {
                resolve({
                    status: 'error',
                    message: 'Empty cart',
                });
                return;
            }

            console.log('cart', cart);
            resolve({
                status: 'success',
                message: 'Cart details',
                data: cart,
            });
        } catch (error) {
            reject(error);
        }
    });
};


const deleteCart = (id) => {
    return new Promise(async (resolve, reject) => { 
        try {
            const cart = await Cart.findOne({_id : id});
            if (cart==null) {
                resolve({
                    status: 'error',
                    message: 'Not found cart'
                })
            }
            await Cart.findByIdAndDelete(id)
            resolve ({
                status: "success",
                message: "Cart details",
                data: cart
            });
        } catch (error) {
            reject(error)
        }
        })
};

module.exports = {
    addToCart,
    decreaseAmountItemFromCart,
    increaseAmountItemFromCart,
    deleteItemFromCart,
    getDetailsCart,
    deleteCart
}; 