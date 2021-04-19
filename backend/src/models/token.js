//lớp Quản lý cửa hàng
module.exports = class Token {
  constructor(
    id, //id - khóa chính
    accountId, //Id tài khoản
    token, //token
    refreshToken,
    createDate, //ngày tạo
    modifyDate //ngày cập nhật token mới nhất
  ) {
    this.id = id;
    this.accountId = accountId;
    this.token = token;
    this.refreshToken = refreshToken;
    this.createDate = createDate;
    this.modifyDate = modifyDate;
  }
};
