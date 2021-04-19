//lớp Quản lý cửa hàng
class AdminShop {
    constructor(
      adminId, //id quản lý cửa hàng - khóa chính
      adminCode, //mã quản lý(cho phép nhìn)
      adminName, //tên quản lý
      phoneNumber, //số điện thoại liên hệ
      email, //địa chỉ email
      address, //địa chỉ thường trú
      password, //mật khẩu
      chatId, //id chat
      shopId, //id cửa hàng
    ) {
      this.adminId = adminId;
      this.adminCode = adminCode;
      this.adminName = adminName;
      this.phoneNumber = phoneNumber;
      this.email = email;
      this.address = address;
      this.password = password;
      this.chatId = chatId;
      this.shopId = shopId;
    }
  }
  
  export default AdminShop;
  