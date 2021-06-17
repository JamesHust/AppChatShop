const express = require("express");
const {
  getAdmins,
  getEmployees,
  getAdminById,
  searchAccountAdmin,
  addNewAccountAdmin,
  updateInfoAccountAdmin,
  updatePassAccount,
  deleteAccountAdmin,
} = require("../controllers/admins");
const { uploadImageAdmin } = require("../uploads/multer");
const { isAuth } = require("../middlewares/auth");

//create router for object: admin
const router = express.Router();

//Thêm tài khoản quản lý cửa hàng mới
router.post("/admins", uploadImageAdmin.single("file"), addNewAccountAdmin);
//Lấy toàn bộ quản lý cửa hàng hoặc lấy theo Id cửa hàng
router.get("/admins", getAdmins);
// lấy danh sách nhân viên theo id cửa hàng
router.get("/employees", getEmployees);
//Lấy chi tiết thông tin tài khoản quản lý theo id
router.get("/admins/:adminId", getAdminById);
//Tìm kiếm tài khoản quản lý theo tên hoặc theo mã quản lý cửa hàng
router.get("/search/admins", searchAccountAdmin);
// Cập nhật mật khẩu tài khoản admin
router.put("/admins/password", updatePassAccount);
//Cập nhật thông tin tài khoản quản lý cửa hàng
router.put(
  "/admins",
  uploadImageAdmin.single("file"),
  updateInfoAccountAdmin
);
//Xóa tài khoản quản lý cửa hàng
router.delete("/admins", deleteAccountAdmin);

module.exports = router;
