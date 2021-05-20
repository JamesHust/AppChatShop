//lớp Nhân viên giao hàng
module.exports = class Shipper {
    constructor(
      shipperId, //id nhân viên giao hàng- khóa chính
      shipperCode, //mã nhân viên giao hàng(cho phép nhìn)
      shipperName, //tên nhân viên giao hàng
      avatar,//ảnh đại diện
      phoneNumber, //số điện thoại liên hệ
      address, //địa chỉ thường trú
      email, //địa chỉ email
      password, //mật khẩu
      basicSalary, //lương cứng
      rating, //đánh giá dịch vụ giao hàng
      chatId, //id chat
      shopId //id cửa hàng hợp tác
    ) {
      this.shipperId = shipperId;
      this.shipperCode = shipperCode;
      this.shipperName = shipperName;
      this.avatar = avatar    ;
      this.phoneNumber = phoneNumber;
      this.address = address;
      this.email = email;
      this.password = password;
      this.basicSalary = basicSalary;
      this.rating = rating;
      this.chatId = chatId;
      this.shopId = shopId;
    }
  }
  