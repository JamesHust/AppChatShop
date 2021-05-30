const express = require("express");
const {
  getCustomers,
  createNewCustomer,
  getCustomerById,
  getRateAndOrders,
  updateInfoCustomer,
  deleteAccountCustomer
} = require("../controllers/customers");
const { isAuth } = require("../middlewares/auth");

//create router for object: customer
const router = express.Router();

//Api tạo tài khoản khách hàng mới
router.post("/customers", createNewCustomer);
//Api lấy danh sách toàn bộ khách hàng
router.get("/customers", isAuth, getCustomers);
// Lấy thông tin số lượng sản phẩm đã đánh giá và số lượng đơn hàng thành công
router.get("/rates/customers", isAuth, getRateAndOrders);
//Api lấy thông tin khách hàng theo id
router.get("/customers/:customerId", isAuth, getCustomerById);
//Api cập nhật thông tin tài khoản khách hàng
router.put("/customers/:customerId", isAuth, updateInfoCustomer);
//Api xóa tài khoản khách hàng
router.delete("/customers/:customerId", isAuth, deleteAccountCustomer);

module.exports = router;
