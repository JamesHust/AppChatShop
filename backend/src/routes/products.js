const express = require("express");
const {
  getProducts,
  getProductById,
  getRandomProducts,
  searchProduct,
  updateInfoProduct,
  deleteProduct,
  updateInfoProductAdmin,
  importMoreProductAdmin,
  importNewProductAdmin,
  getProductsByArea
} = require("../controllers/products");
const { isAuth } = require("../middlewares/auth");
const { uploadImageProduct } = require("../uploads/multer");

//create router for object: product
const router = express.Router();

//Lấy toàn bộ sản phẩm có theo id cửa hàng và id loại sản phẩm
router.get("/products", getProducts);
//Lấy toàn bộ sản phẩm theo khu vực, có tìm kiếm theo tên sản phẩm
router.get("/area/products", getProductsByArea);
//Lấy random sản phẩm có theo id cửa hàng và id loại sản phẩm
router.get("/products/random/:numProducts", getRandomProducts);
//Lấy chi tiết sản phẩm theo id
router.get("/products/:productId", getProductById);
//Tìm kiếm sản phẩm theo tên hoặc theo mã sản phẩm
router.get("/search/products", searchProduct);
// //Thêm sản phẩm mới
// router.post("/products", isAuth, addNewProduct);
//Cập nhật thông tin sản phẩm
router.put("/products/:productId", isAuth, updateInfoProduct);

/**
 * Route cho admin
 */
//Cập nhật thông tin sản phẩm
router.put(
  "/admin/products",
  isAuth,
  uploadImageProduct.single("file"),
  updateInfoProductAdmin
);
// Nhập thêm sản phẩm đã có trong kho
router.put("/admin/import", isAuth, importMoreProductAdmin);
// Thêm sản phẩm mới
router.post("/products", isAuth, uploadImageProduct.single("file"), importNewProductAdmin);
//Xóa sản phẩm
router.delete("/products/:productId", isAuth, deleteProduct);

module.exports = router;
