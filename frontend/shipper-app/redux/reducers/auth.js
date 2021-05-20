import { SAVE_TOKEN, REMOVE_TOKEN } from "../actions/auth";

const initialState = {
  token: "",
  shipper: {
    shipperId: "", //id shipper - khóa chính
    shipperCode: "", //mã shipper(cho phép nhìn)
    shipperName: "", //tên shipper
    avatar: "", //ảnh đại diện
    phoneNumber: "", //số điện thoại liên hệ
    address: "", //địa chỉ thường trú
    email: "", //địa chỉ email
    password: "", //mật khẩu
    basicSalary: "",//lương cứng
    rating: "",//đánh giá
    shopId: "", //id cửa hàng
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const shipper = action.shipper;
      const token = action.token;
      return {
        ...state,
        token: token,
        shipper: {
          shipperId: shipper.shipperId ? shipper.shipperId: shipper.ShipperId, //id shipper - khóa chính
          shipperCode: shipper.shipperCode ? shipper.shipperCode : shipper.ShipperCode, //mã shipper(cho phép nhìn)
          shipperName: shipper.shipperName ? shipper.shipperName : shipper.ShipperName, //tên shipper
          avatar: shipper.avatar ? shipper.avatar : shipper.Avatar, //ảnh đại diện
          phoneNumber: shipper.phoneNumber ? shipper.phoneNumber : shipper.PhoneNumber, //số điện thoại liên hệ
          address: shipper.address ? shipper.address : shipper.Address, //địa chỉ thường trú
          email: shipper.email ? shipper.email : shipper.Email, //địa chỉ email
          password: shipper.password ? shipper.password : shipper.Password, //mật khẩu
          basicSalary: shipper.basicSalary ? shipper.basicSalary : shipper.BasicSalary,//lương cứng
          rating: shipper.rating ? shipper.rating : shipper.Rating,//đánh giá
          shopId: shipper.shopId ? shipper.shopId : shipper.ShopId, //id cửa hàng
        },
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: "",
        shipper: {
          shipperId: "", //id shipper - khóa chính
          shipperCode: "", //mã shipper(cho phép nhìn)
          shipperName: "", //tên shipper
          avatar: "", //ảnh đại diện
          phoneNumber: "", //số điện thoại liên hệ
          address: "", //địa chỉ thường trú
          email: "", //địa chỉ email
          password: "", //mật khẩu
          basicSalary: "",//lương cứng
          rating: "",//đánh giá
          shopId: "", //id cửa hàng
        },
      };
  }
  return state;
};
