import { SAVE_TOKEN, REMOVE_TOKEN } from "../actions/auth";

const initialState = {
  token: "",
  customer: {
    customerId: "", //id khách hàng - khóa chính
    customerCode: "", //mã khách hàng(cho phép nhìn)
    customerName: "", //tên khách hàng
    phoneNumber: "", //số điện thoại liên hệ
    otherPhoneNumber: "", //số điện thoại liên hệ khác
    address: "", //địa chỉ thường trú
    email: "", //địa chỉ email
    password: "", //mật khẩu
    chatId: "", //id chat
    avatar: ""
  },
  admin: {
    adminId: "",
    adminCode: "",
    adminName: "",
    phoneNumber: "",
    email: "", //địa chỉ email
    address: "", //địa chỉ thường trú
    password: "", //mật khẩu
    chatId: "", //id chat
    shopId: "",
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const customer = action.customer;
      const token = action.token;
      return {
        ...state,
        token: token,
        customer: {
          customerId: customer.customerId ? customer.customerId: customer.CustomerId, //id khách hàng - khóa chính
          customerCode: customer.customerCode ? customer.customerCode : customer.CustomerCode, //mã khách hàng(cho phép nhìn)
          customerName: customer.customerName ? customer.customerName : customer.CustomerName, //tên khách hàng
          avatar: customer.avatar ? customer.avatar : customer.Avatar, //tên khách hàng
          phoneNumber: customer.phoneNumber ? customer.phoneNumber : customer.PhoneNumber, //số điện thoại liên hệ
          otherPhoneNumber: customer.otherPhoneNumber ? customer.otherPhoneNumber : customer.OtherPhoneNumber, //số điện thoại liên hệ khác
          address: customer.address ? customer.address : customer.Address, //địa chỉ thường trú
          email: customer.email ? customer.email : customer.Email, //địa chỉ email
          password: customer.password ? customer.password : customer.Password, //mật khẩu
          chatId: customer.chatId ? customer.chatId : customer.ChatId, //id chat
        },
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: "",
        customer: {
          customerId: "", //id khách hàng - khóa chính
          customerCode: "", //mã khách hàng(cho phép nhìn)
          customerName: "", //tên khách hàng
          phoneNumber: "", //số điện thoại liên hệ
          otherPhoneNumber: "", //số điện thoại liên hệ khác
          address: "", //địa chỉ thường trú
          email: "", //địa chỉ email
          password: "", //mật khẩu
          chatId: "", //id chat
        },
      };
  }
  return state;
};
