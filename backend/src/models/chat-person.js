//lớp Thông tin người nhận tin nhắn
//Đây là lớp thành phần trong lớp lớn DetailMessage
module.exports = class ChatPerson {
  constructor(
    _id, //Id người nhận, mặc định là 1 hoặc "1" nếu là khách hàng
    name, //Tên người nhận
    avatar //avatar người nhận
  ) {
    this._id = _id;
    this.name = name;
    this.avatar = avatar;
  }
};
