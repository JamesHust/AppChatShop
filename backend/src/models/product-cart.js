//lớp Sản phẩm trong giỏ hàng
module.exports = class ProductCart {
  constructor(
    id,//khóa chính
    productId, //id sản phẩm
    productAmount, //số lượng mua
    productPrice, //giá sản phẩm
    cartId //id giỏ hàng
  ) {
    this.id = id;
    this.productId = productId;
    this.productAmount = productAmount;
    this.productPrice = productPrice;
    this.cartId = cartId;
  }
};
