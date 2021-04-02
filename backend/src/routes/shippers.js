const express = require("express");
const {
    getShippers,
    getShipperById,
    searchAccountShipper,
    addNewAccountShipper,
    updateInfoAccountShipper,
    deleteAccountShipper,
} = require("../controllers/shippers");

//create router for object: admin
const router = express.Router();

//Lấy toàn bộ tài khoản shipper hoặc lấy theo Id cửa hàng
router.get("/shippers", getShippers);
//Lấy chi tiết thông tin tài khoản shipper theo id
router.get("/shippers/:shipperId", getShipperById);
//Tìm kiếm tài khoản shipper theo tên hoặc theo mã shipper
router.get("/search/shippers", searchAccountShipper);
//Thêm tài khoản shipper mới
router.post("/shippers", addNewAccountShipper);
//Cập nhật thông tin tài khoản shipper
router.put("/shippers/:shipperId", updateInfoAccountShipper);
//Xóa tài khoản shipper
router.delete("/shippers/:shipperId", deleteAccountShipper);

module.exports = router;
