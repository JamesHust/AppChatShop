//lớp Loại sản phẩm
module.exports = class Category {
  constructor(
    categoryId, //id loại sản phẩm - khóa chính
    categoryCode, //mã loại sản phẩm(cho phép người dùng nhìn)
    categoryName //tên loại sản phẩm
  ) {
    this.categoryId = categoryId;
    this.categoryCode = categoryCode;
    this.categoryName = categoryName;
  }
};
