//lớp base Đối tượng trả về mọi API
module.exports = class Response {
    constructor(
      isSuccess = true, //Truy xuất dữ liệu có thành công không
      errorCode, //Mã lỗi hệ thống trả về: DB001:Lỗi lấy dữ liêu, DB002: lỗi cập nhật dữ liệu, DB003: lỗi xóa dữ liệu, DB004: Lỗi thêm mới dữ liệu
      devMsg, //Thông tin lỗi trả về cho dev
      userMsg, //Mã lỗi trả về cho khách hàng
      moreInfo, //Thông tin thêm 
      data, //dữ liệu trả về
    ) {
      this.isSuccess = isSuccess;
      this.errorCode = errorCode;
      this.devMsg = devMsg;
      this.userMsg = userMsg;
      this.moreInfo = moreInfo;
      this.data = data;
    }
  };
  