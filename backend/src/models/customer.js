//lớp Khách hàng
module.exports = class Customer {
  constructor(
    customerId, //id khách hàng - khóa chính
    customerCode, //mã khách hàng(cho phép nhìn)
    customerName, //tên khách hàng
    avatar,//ảnh đại diện
    phoneNumber, //số điện thoại liên hệ
    otherPhoneNumber, //số điện thoại liên hệ khác
    address, //địa chỉ thường trú
    email, //địa chỉ email
    password, //mật khẩu
    chatId, //id chat
    areaId//id khu vực 
  ) {
    this.customerId = customerId;
    this.customerCode = customerCode;
    this.customerName = customerName;
    this.avatar = avatar;
    this.phoneNumber = phoneNumber;
    this.otherPhoneNumber = otherPhoneNumber;
    this.address = address;
    this.email = email;
    this.password = password;
    this.chatId = chatId;
    this.areaId = areaId;
  }
};
