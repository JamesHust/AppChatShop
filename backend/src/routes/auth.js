const express = require("express");
const { loginAuth, refreshTokenToLogin, logout } = require("../controllers/auth");

//create router for object: product
const router = express.Router();

//Đăng nhập
router.post("/login", loginAuth);
//Đăng xuất
router.post("/logout", logout);
//Thêm, sửa, xóa sản phẩm trong giỏ hàng
router.post("/check/token", refreshTokenToLogin);

module.exports = router;
