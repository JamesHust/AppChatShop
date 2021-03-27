//lớp Đơn hàng
class Order {
  constructor(
    orderId, //id đơn hàng - khóa chính
    orderCode, //mã đơn hàng(cho phép nhìn)
    customerId, //tên khách hàng
    total, //tổng tiền đơn hàng
    status, //trạng thái đơn hàng( 0 - Thất bại,  1 - Thành công, 2 - Khác)
    createDate, //thời gian tạo đơn hàng
    modifyDate, //thời điểm cập nhật thông tin đơn hàng gần đây nhất
    shopId //id cửa hàng
  ) {
    this.orderId = orderId;
    this.orderCode = orderCode;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
    this.createDate = createDate;
    this.modifyDate = modifyDate;
    this.shopId = shopId;
  }
}

export default Order;
