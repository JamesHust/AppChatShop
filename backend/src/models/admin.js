//lớp Quản lý cửa hàng
module.exports = class Admin {
  constructor(
    adminId, //id quản lý cửa hàng - khóa chính
    adminCode, //mã quản lý(cho phép nhìn)
    iDCardCode, //Mã CMND, CCCD
    adminName, //tên quản lý
    role, //Vai trò: 0-Chưa xác định, 1-Chủ cửa hàng, 2-Nhân viên
    gender, //Giới tính
    avatar, //Ảnh đại diện
    birthday, //Ngày sinh
    homeTown, //Quê quán
    phoneNumber, //số điện thoại liên hệ
    email, //địa chỉ email
    basicSalary, //lương cơ bản
    address, //địa chỉ thường trú
    password, //mật khẩu
    chatId, //id chat
    shopId //id cửa hàng
  ) {
    this.adminId = adminId;
    this.adminCode = adminCode;
    this.iDCardCode = iDCardCode;
    this.adminName = adminName;
    this.role = role;
    this.gender = gender;
    this.avatar = avatar;
    this.birthday = birthday;
    this.homeTown = homeTown;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.basicSalary = basicSalary;
    this.address = address;
    this.password = password;
    this.chatId = chatId;
    this.shopId = shopId;
  }
};
