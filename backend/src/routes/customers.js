const express = require("express");
const {
  getCustomers,
  getCustomerOtherArea,
  createNewCustomer,
  getCustomerById,
  getRateAndOrders,
  updateAreaForCustomer,
  updateInfoCustomer,
  deleteAccountCustomer
} = require("../controllers/customers");
const { isAuth } = require("../middlewares/auth");
const { uploadImageCustomer } = require("../uploads/multer");

//create router for object: customer
const router = express.Router();

//Api tạo tài khoản khách hàng mới
router.post("/customers", uploadImageCustomer.single("file"), createNewCustomer);
// Api tra cứu khách hàng ngoài khu vực
router.get("/lookup/customers", getCustomerOtherArea);
//Api lấy danh sách toàn bộ khách hàng, Lấy theo khu vực nếu cần
router.get("/customers", getCustomers);
// Lấy thông tin số lượng sản phẩm đã đánh giá và số lượng đơn hàng thành công
router.get("/rates/customers", getRateAndOrders);
//Api lấy thông tin khách hàng theo id
router.get("/customers/:customerId", getCustomerById);
//Api cập nhật thông tin tài khoản khách hàng
router.put("/customers/:customerId", updateInfoCustomer);
// Api cập nhật khu vực cho khách hàng
router.put("/area/customers", updateAreaForCustomer);
//Api xóa tài khoản khách hàng
router.delete("/customers/:customerId", deleteAccountCustomer);

module.exports = router;
