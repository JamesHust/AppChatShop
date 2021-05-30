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
router.post("/admins", isAuth, uploadImageAdmin.single("file"), addNewAccountAdmin);
//Lấy toàn bộ quản lý cửa hàng hoặc lấy theo Id cửa hàng
router.get("/admins", isAuth, getAdmins);
// lấy danh sách nhân viên theo id cửa hàng
router.get("/employees", isAuth, getEmployees);
//Lấy chi tiết thông tin tài khoản quản lý theo id
router.get("/admins/:adminId", isAuth, getAdminById);
//Tìm kiếm tài khoản quản lý theo tên hoặc theo mã quản lý cửa hàng
router.get("/search/admins", isAuth, searchAccountAdmin);
// Cập nhật mật khẩu tài khoản admin
router.put("/admins/password", isAuth, updatePassAccount);
//Cập nhật thông tin tài khoản quản lý cửa hàng
router.put(
  "/admins",
  isAuth,
  uploadImageAdmin.single("file"),
  updateInfoAccountAdmin
);
//Xóa tài khoản quản lý cửa hàng
router.delete("/admins", isAuth, deleteAccountAdmin);

module.exports = router;
