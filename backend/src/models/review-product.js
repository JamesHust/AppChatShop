//lớp Đánh giá sản phẩm
module.exports = class ReviewProduct {
  constructor(
    id, //id - khóa chính
    customerId, //id khách hàng
    productId, //id sản phẩm
    rating, //đánh giá
    reviewText, //nội dung đánh giá
    isFavourite //Có yêu thích không
  ) {
    this.id = id;
    this.customerId = customerId;
    this.productId = productId;
    this.rating = rating;
    this.reviewText = reviewText;
    this.isFavourite = isFavourite;
  }
};
