const express = require("express");
const { loginAuth, refreshToken, logout } = require("../controllers/auth");

//create router for object: product
const router = express.Router();

//Đăng nhập
router.post("/login", loginAuth);
//Đăng xuất
router.post("/logout", logout);
//Thêm, sửa, xóa sản phẩm trong giỏ hàng
router.post("/refresh/token", refreshToken);

module.exports = router;
