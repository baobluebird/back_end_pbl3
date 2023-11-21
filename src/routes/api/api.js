const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const CartRouter = require('./CartRouter')
const adminUserRouter = require('./adminUserRouter')
const adminProductRouter = require('./adminProductRouter')
const adminLoginRouter = require('./adminLoginRouter')
const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/cart', CartRouter) 
    app.use('/admin/user', adminUserRouter)
    app.use('/admin/product', adminProductRouter)
    app.use('/admin/',adminLoginRouter)
}

module.exports = routes