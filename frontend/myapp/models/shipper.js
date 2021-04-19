//lớp Nhân viên giao hàng
class Shipper {
  constructor(
    shipperId, //id nhân viên giao hàng- khóa chính
    shipperCode, //mã nhân viên giao hàng(cho phép nhìn)
    shipperName, //tên nhân viên giao hàng
    phoneNumber, //số điện thoại liên hệ
    address, //địa chỉ thường trú
    email, //địa chỉ email
    password, //mật khẩu
    rating, //đánh giá dịch vụ giao hàng
    chatId, //id chat
    shopId //id cửa hàng hợp tác
  ) {
    this.shipperId = shipperId;
    this.shipperCode = shipperCode;
    this.shipperName = shipperName;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.email = email;
    this.password = password;
    this.rating = rating;
    this.chatId = chatId;
    this.shopId = shopId;
  }
}

export default Shipper;
