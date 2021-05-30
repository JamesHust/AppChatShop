const express = require("express");
const {
    getShops,
    getShopById,
    searchShop,
    addNewShop,
    updateInfoShop,
    deleteShop,
} = require("../controllers/shops");
const { uploadImageShop } = require("../uploads/multer");

//create router for object: admin
const router = express.Router();

//Lấy toàn bộ shop
router.get("/shops", getShops);
//Lấy chi tiết thông tin shop theo id
router.get("/shops/:shopId", getShopById);
//Tìm kiếm shop theo tên hoặc theo mã shop
router.get("/search/shops", searchShop);
//Thêm shop mới
router.post("/shops", addNewShop);
//Cập nhật thông tin cửa hàng
router.put("/shops", uploadImageShop.single("file"), updateInfoShop);
//Xóa dữ liệu cửa hàng
router.delete("/shops/:shopId", deleteShop);

module.exports = router;
