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


const deleteCart = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            resolve({
                status: 'error',
                message: 'Not found user or product'
            })
        }


        return {
            status: "success",
            message: "Cart deleted successfully",
        };
    } catch (error) {
        reject(error)
    }
}

module.exports = {
    addToCart,
    deleteCart,
};
