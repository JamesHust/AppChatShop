//lớp Giỏ hàng
class Cart {
  constructor(
    cartId, //id giỏ hàng - khóa chính
    customerId, //id khách hàng
    total, //tổng tiền giỏ hàng
    shopId //id cửa hàng
  ) {
    this.cartId = cartId;
    this.customerId = customerId;
    this.total = total;
    this.shopId = shopId;
  }
}

export default Cart;
