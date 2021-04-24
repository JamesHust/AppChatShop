const express = require("express");
const {
    getReview,
    getListFavouriteProduct,
    reviewProduct
} = require("../controllers/review-product");

//create router for object: review
const router = express.Router();

//Lấy đánh giá 1 sản phẩm của khách hàng
router.get("/products", getReview);
//Lấy danh sách sản phẩm yêu thích
router.get("/products/:idCustomer", getListFavouriteProduct);
//Thêm hoặc cập nhật đánh giá sản phẩm
router.post("/products", reviewProduct);

module.exports = router;
