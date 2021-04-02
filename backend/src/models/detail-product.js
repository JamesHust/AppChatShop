const Product = require("./product");
//lớp Thông tin chi tiết sản phẩm trong giỏ hàng và đơn hàng
module.exports = class DetailProduct extends Product {
  constructor(
    productId, //id sản phẩm - khóa chính
    productCode, //mã sản phẩm(cho phép người dùng nhìn)
    productName, //tên sản phẩm
    description, //mô tả
    imageUrl, //đường dẫn hình ảnh minh họa sản phẩm
    importPrice, //giá nhập hàng
    purchasePrice, //giá bán
    amount, //số lượng sản phẩm còn trong kho
    quantitySold, //số lượng sản phẩm đã bán
    dateOfImport, //ngày nhập hàng gần nhất
    rating, //đánh giá
    sale, //giảm giá
    shopId, //id cửa hàng
    categoryId, //id loại sản phẩm
    cartId, //id giỏ hàng
    orderId, //id giỏ hàng
    productAmount, //số lượng sản phẩm
    productPrice //giá tiền bán hiện tại
  ) {
    super(
      productId,
      productCode,
      productName,
      description,
      imageUrl,
      importPrice,
      purchasePrice,
      amount,
      quantitySold,
      dateOfImport,
      rating,
      sale,
      shopId,
      categoryId
    );
    this.cartId = cartId;
    this.orderId = orderId;
    this.productAmount = productAmount;
    this.productPrice = productPrice;
  }
};
