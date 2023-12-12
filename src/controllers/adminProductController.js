const CRUDProductService = require('../services/CRUDProductService');  

const getHomepage = async (req, res) => {
    try {
        const sort = req.query.sort;
        console.log('sort',sort);
        console.log('req.query', req.query);
        const listProducts = await CRUDProductService.getAllProduct(sort||null);
        return res.render('product/homepageProduct.ejs', { listProducts: listProducts });
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching users',
        });
    }
}

const postCreateProduct = async (req, res) => {
    console.log(req.body);
    await CRUDProductService.createProduct(req.body); 
    res.redirect('/admin/product/');
}

const getCreateProduct = (req, res) => {
    res.render('product/createProduct.ejs');
}

const getUpdatePage = async (req, res) => {

    const productId = req.params.id;

    let product = await CRUDProductService.getDetailsProduct(productId);

    res.render('product/editProduct.ejs', { productEdit : product });//{userEdit : user} = {userEdit : results[0]}
}

const postUpdateProduct = async (req, res) => {
    const productId = req.body.productId;
    const data = req.body;
    await CRUDProductService.updateProduct(productId, data)

    res.redirect('/admin/product/');

}

const postDeleteProduct = async (req, res) => {
    const productId = req.params.id;
    let product = await CRUDProductService.getDetailsProduct(productId);

    res.render('product/deleteProduct.ejs', { productEdit : product });
}

const postHandleRemoveProduct = async (req, res) => {
    const productId = req.body.productId;
    await CRUDProductService.deleteProduct(productId)
    
    return res.redirect('/admin/product/');
}

module.exports = {
    getHomepage,
    postCreateProduct,
    getCreateProduct,
    getUpdatePage,
    postUpdateProduct,
    postDeleteProduct,
    postHandleRemoveProduct,
}