const express = require("express");
const {
  getBoardChat,
  getListMessage,
  addNewMessage,
} = require("../controllers/messages");

//create router for object: product
const router = express.Router();

//Lấy tất cả bảng chat cho từng khách hàng
router.get("/board/:customerId", getBoardChat);
//Lấy danh sách tin nhắn theo từng phòng chat
router.get("/room/:roomId", getListMessage);
// Thêm tin nhắn mới vào cơ sở dữ liệu
router.post("/", addNewMessage);

module.exports = router;
