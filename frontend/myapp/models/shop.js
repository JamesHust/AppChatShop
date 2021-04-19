//lớp Cửa hàng
class Shop {
  constructor(
    shopId, //id cửa hàng - khóa chính
    shopCode, //mã cửa hàng(cho phép nhìn)
    shopName, //tên cửa hàng
    phoneNumber, //số điện thoại liên hệ
    otherPhoneNumber, //số điện thoại liên hệ khác
    address, //địa chỉ thường trú
    email, //địa chỉ email
    openTime, //thời gian mở cửa
    closeTime, //tThời gian đóng cửa
    rating //đánh giá chất lượng cửa hàng
  ) {
    this.shopId = shopId;
    this.shopCode = shopCode;
    this.shopName = shopName;
    this.phoneNumber = phoneNumber;
    this.otherPhoneNumber = otherPhoneNumber;
    this.address = address;
    this.email = email;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.rating = rating;
  }
}

export default Shop;
