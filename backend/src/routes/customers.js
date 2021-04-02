const express = require("express");
const {
  getCustomers,
  createNewCustomer,
  getCustomerById,
  updateInfoCustomer,
  deleteAccountCustomer
} = require("../controllers/customers");

//create router for object: customer
const router = express.Router();

//Api lấy danh sách toàn bộ khách hàng
router.get("/customers", getCustomers);
//Api lấy thông tin khách hàng theo id
router.get("/customers/:customerId", getCustomerById);
//Api tạo tài khoản khách hàng mới
router.post("/customers", createNewCustomer);
//Api cập nhật thông tin tài khoản khách hàng
router.put("/customers/:customerId", updateInfoCustomer);
//Api xóa tài khoản khách hàng
router.delete("/customers/:customerId", deleteAccountCustomer);

module.exports = router;
