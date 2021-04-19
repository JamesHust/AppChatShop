//lớp Loại sản phẩm
class Category {
  constructor(
    cateId, //id loại sản phẩm - khóa chính
    cateCode, //mã loại sản phẩm(cho phép người dùng nhìn)
    cateName, //tên loại sản phẩm
    shopId, //id cửa hàng
  ) {
    this.cateId = cateId;
    this.cateCode = cateCode;
    this.cateName = cateName;
    this.shopId = shopId;
  }
}

export default Category;
