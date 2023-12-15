const CRUDProductService = require("../services/CRUDProductService");

const getHomepage = async (req, res) => {
  try {
    let sortName = null;
    let sortType = null;
    let brand = null;
    let searchName = null;
    let type = null;
    let nameSort = "";

    if (req.query.sort && typeof req.query.sort === "object") {
      sortName = req.query.sort[0];
      sortType = req.query.sort[1];
      nameSort = req.query.sort[2];
      brand = req.query.brand;
    }
    if (req.query.search) {
      searchName = req.query.search;
    }

    if (req.query.type) {
      type = req.query.type;
    }
    switch (nameSort) {
      case "name-asc":
        nameSort = "Tên A - Z";
        break;
      case "name-desc":
        nameSort = "Tên Z - A";
        break;
      case "createdAt-asc":
        nameSort = "Cũ đến mới";
        break;
      case "createdAt-desc":
        nameSort = "Mới đến cũ";
        break;
      case "new_price-asc":
        nameSort = "Giá thấp đến cao";
        break;
      case "new_price-desc":
        nameSort = "Giá cao đến thấp";
        break;
      case "countInStock-asc":
        nameSort = "Số lượng trong kho thấp đến cao";
        break;
      case "countInStock-desc":
        nameSort = "Số lượng trong kho cao đến thấp";
        break;
      case "total_rate-asc":
        nameSort = "Đánh giá sao thấp đến cao";
      case "total_rate-desc":
        nameSort = "Đánh giá sao cao đến thấp";
        break;
      case "selled-asc":
        nameSort = "Đã bán ít đến nhiều";
        break;
      case "selled-desc":
        nameSort = "Đã bán nhiều đến ít";
        break;
      case "comments-asc":
        nameSort = "Lượt đánh giá ít đến nhiều";
        break;
      case "comments-desc":
        nameSort = "Lượt đánh giá nhiều đến ít";
        break;
      default:
        break;
    }
    const listProducts = await CRUDProductService.getAllProduct(
      sortName,
      sortType,
      searchName,
      type,
      brand
    );
    return res.render("product/homepageProduct.ejs", {
      listProducts: listProducts,
      nameSort: nameSort,
      nameSearch: searchName,
      count: listProducts.length,
      type: type || brand,
    });
  } catch (e) {
    return res.render("product/homepageProduct.ejs", {
      errorMes: "Error search products",
    });
  }
};

const getRatingPage = async (req, res) => {
  const productId = req.params.id;
  let product = await CRUDProductService.getRatingProduct(productId);
  res.render("product/ratingProduct.ejs", { product: product });
};

const postCreateProduct = async (req, res) => {
  await CRUDProductService.createProduct(req.body);
  res.redirect("/admin/product/");
};

const getCreateProduct = (req, res) => {
  res.render("product/createProduct.ejs");
};

const getUpdatePage = async (req, res) => {
  const productId = req.params.id;

  let product = await CRUDProductService.getDetailsProduct(productId);

  res.render("product/editProduct.ejs", { productEdit: product }); //{userEdit : user} = {userEdit : results[0]}
};

const postUpdateProduct = async (req, res) => {
  const productId = req.body.productId;
  const data = req.body;
  await CRUDProductService.updateProduct(productId, data);

  res.redirect("/admin/product/");
};

const postDeleteProduct = async (req, res) => {
  const productId = req.params.id;
  let product = await CRUDProductService.getDetailsProduct(productId);

  res.render("product/deleteProduct.ejs", { productEdit: product });
};

const postHandleRemoveProduct = async (req, res) => {
  const productId = req.body.productId;
  await CRUDProductService.deleteProduct(productId);

  return res.redirect("/admin/product/");
};

module.exports = {
  getHomepage,
  getRatingPage,
  postCreateProduct,
  getCreateProduct,
  getUpdatePage,
  postUpdateProduct,
  postDeleteProduct,
  postHandleRemoveProduct,
};
