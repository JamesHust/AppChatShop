//lớp Sản phẩm trong đơn hàng
module.exports = class ProductOrder {
  constructor(
    id,//khóa chính
    productId, //id sản phẩm
    productAmount, //số lượng mua
    productPrice, //giá sản phẩm
    orderId //id đơn hàng
  ) {
    this.id = id;
    this.productId = productId;
    this.productAmount = productAmount;
    this.productPrice = productPrice;
    this.orderId = orderId;
  }
};
