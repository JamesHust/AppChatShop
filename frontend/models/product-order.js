//lớp Sản phẩm trong đơn hàng
class ProductOrder {
    constructor(
      productId, //id sản phẩm
      productAmount, //số lượng mua
      productPrice, //giá sản phẩm
      orderId //id đơn hàng
    ) {
      this.productId = productId;
      this.productAmount = productAmount;
      this.productPrice = productPrice;
      this.orderId = orderId;
    }
  }
  
  export default ProductOrder;
  