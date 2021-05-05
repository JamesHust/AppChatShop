const ChatPerson = require("./chat-person");
//lớp Chi tiết từng gói tin nhắn chat
module.exports = class DetailMessageText {
  constructor(
    _id, //Id mỗi tin nhắn - khóa chính
    text, //Tin nhắn text
    createdAt, //Thời gian khởi tạo hay gửi tin nhắn
    idUser, //Id người nhận, mặc định là 1 hoặc "1" nếu là khách hàng
    nameUser, //Tên người nhận
    avatarUser //ảnh đại diện người nhận
  ) {
    this._id = _id;
    this.text = text;
    this.createdAt = new Date(createdAt);
    this.user = new ChatPerson(idUser, nameUser, avatarUser);
  }
};
