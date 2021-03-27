//lớp Sản phẩm trong giỏ hàng
class ProductCart {
  constructor(
    productId, //id sản phẩm
    productAmount, //số lượng mua
    productPrice, //giá sản phẩm
    cartId //id giỏ hàng
  ) {
    this.productId = productId;
    this.productAmount = productAmount;
    this.productPrice = productPrice;
    this.cartId = cartId;
  }
}

export default ProductCart;
