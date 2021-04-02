const express = require("express");
const {
  getProducts,
  getProductById,
  getRandomProducts,
  searchProduct,
  addNewProduct,
  updateInfoProduct,
  deleteProduct
} = require("../controllers/products");

//create router for object: product
const router = express.Router();

//Lấy toàn bộ sản phẩm có theo id cửa hàng và id loại sản phẩm
router.get("/products", getProducts);
//Lấy random sản phẩm có theo id cửa hàng và id loại sản phẩm
router.get("/products/random/:numProducts", getRandomProducts);
//Lấy chi tiết sản phẩm theo id
router.get("/products/:productId", getProductById);
//Tìm kiếm sản phẩm theo tên hoặc theo mã sản phẩm
router.get("/search/products", searchProduct);
//Thêm sản phẩm mới
router.post("/products", addNewProduct);
//Cập nhật thông tin sản phẩm
router.put("/products/:productId", updateInfoProduct);
//Xóa sản phẩm
router.delete("/products/:productId", deleteProduct);

module.exports = router;
