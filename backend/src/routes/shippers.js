const express = require("express");
const {
  getShippers,
  getShipperById,
  searchAccountShipper,
  addNewAccountShipper,
  updateInfoAccountShipper,
  deleteAccountShipper,
} = require("../controllers/shippers");
const {
  receiveOrder,
  getReceivedOrders,
  deleteDeliveryOrder,
  cancelOrderForShipper,
  getSumDeptForShipper,
  getHistorySuccessDelive,
  getDetailCancelOrders,
} = require("../controllers/delivery-order");
const { isAuth } = require("../middlewares/auth");
const { uploadImageShipper } = require("../uploads/multer");

//create router for object: admin
const router = express.Router();

//Lấy toàn bộ tài khoản shipper hoặc lấy theo Id cửa hàng
router.get("/shippers", getShippers);
//Lấy chi tiết thông tin tài khoản shipper theo id
router.get("/shippers/:shipperId", getShipperById);
//Tìm kiếm tài khoản shipper theo tên hoặc theo mã shipper
router.get("/search/shippers", searchAccountShipper);
//Cập nhật thông tin tài khoản shipper
router.put(
  "/shippers",
  isAuth,
  uploadImageShipper.single("file"),
  updateInfoAccountShipper
);
//Xóa tài khoản shipper
router.delete("/shippers", isAuth, deleteAccountShipper);
//Thêm tài khoản shipper mới
router.post(
  "/shippers",
  isAuth,
  uploadImageShipper.single("file"),
  addNewAccountShipper
);

/**
 * Route cho các API phục vụ Shipper
 */
// Lấy danh sách đơn hàng cần giao của shipper đó
router.get("/delivery/:shipperId", getReceivedOrders);
// Lấy tổng tiền công nợ của shipper
router.get("/debt/delivery", getSumDeptForShipper);
// Lấy lịch sử giao hàng thành công của shipper
router.get("/history/delivery", getHistorySuccessDelive);
//Hàm lấy chi tiết sản phẩm trong từng đơn hàng
router.get("/detail/delivery", getDetailCancelOrders);
// Nhận đơn để giao hàng
router.post("/shippers/receive", receiveOrder);
// Hủy đơn hàng từ phía shipper
router.put("/delivery/cancel", cancelOrderForShipper);
// Xóa đơn hàng đang được giao
router.delete("/delivery/:orderId", deleteDeliveryOrder);

module.exports = router;
