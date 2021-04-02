const express = require("express");
const {
  getAdmins,
  getAdminById,
  searchAccountAdmin,
  addNewAccountAdmin,
  updateInfoAccountAdmin,
  deleteAccountAdmin,
} = require("../controllers/admins");

//create router for object: admin
const router = express.Router();

//Lấy toàn bộ quản lý cửa hàng hoặc lấy theo Id cửa hàng
router.get("/admins", getAdmins);
//Lấy chi tiết thông tin tài khoản quản lý theo id
router.get("/admins/:adminId", getAdminById);
//Tìm kiếm tài khoản quản lý theo tên hoặc theo mã quản lý cửa hàng
router.get("/search/admins", searchAccountAdmin);
//Thêm tài khoản quản lý cửa hàng mới
router.post("/admins", addNewAccountAdmin);
//Cập nhật thông tin tài khoản quản lý cửa hàng
router.put("/admins/:adminId", updateInfoAccountAdmin);
//Xóa tài khoản quản lý cửa hàng
router.delete("/admins/:adminId", deleteAccountAdmin);

module.exports = router;
