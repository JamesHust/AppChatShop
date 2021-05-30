import {
  SAVE_TOKEN,
  REMOVE_TOKEN,
  GET_ADMIN,
  CHANGE_PASS,
} from "../actions/auth";

const initialState = {
  token: "",
  admin: {
    adminId: "", //id quản lý cửa hàng
    adminCode: "", //mã quản lý cửa hàng
    iDCardCode: "", //mã CMND/CCCD
    adminName: "", //tên quản lý
    role: "", //vai trò
    gender: 0, //giới tính
    avatar: "", //ảnh đại diện
    birthday: "", //ngày sinh
    phoneNumber: "", //số điện thoại
    email: "", //địa chỉ email
    basicSalary: "", //lương cơ bản: ""
    address: "", //địa chỉ thường trú
    homeTown: "", //quên quán
    password: "", //mật khẩu
    chatId: "", //id chat
    shopId: "", //id cửa hàng
  },
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const admin = action.admin;
      const token = action.token;
      return {
        ...state,
        token: token,
        admin: {
          adminId: admin.adminId ? admin.adminId : admin.AdminId,
          adminCode: admin.adminCode ? admin.adminCode : admin.AdminCode,
          iDCardCode: admin.iDCardCode ? admin.iDCardCode : admin.IDCardCode,
          adminName: admin.adminName ? admin.adminName : admin.AdminName,
          role: admin.role ? admin.role : admin.Role,
          gender: admin.gender ? admin.gender : admin.Gender,
          avatar: admin.avatar ? admin.avatar : admin.Avatar,
          birthday: admin.birthday ? admin.birthday : admin.Birthday,
          phoneNumber: admin.phoneNumber
            ? admin.phoneNumber
            : admin.PhoneNumber, //số điện thoại liên hệ
          address: admin.address ? admin.address : admin.Address, //địa chỉ thường trú
          homeTown: admin.homeTown ? admin.homeTown : admin.HomeTown, //quê quán
          email: admin.email ? admin.email : admin.Email, //địa chỉ email
          basicSalary: admin.basicSalary ? admin.basicSalary : admin.BasicSalary, //lương cơ bản
          password: admin.password ? admin.password : admin.Password, //mật khẩu
          chatId: admin.chatId ? admin.chatId : admin.ChatId, //id chat
          shopId: admin.shopId ? admin.shopId : admin.ShopId, //id chat
        },
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: "",
        admin: {
          adminId: "", //id quản lý cửa hàng
          adminCode: "", //mã quản lý cửa hàng
          iDCardCode: "", //mã CMND/CCCD
          adminName: "", //tên quản lý
          role: "", //vai trò
          gender: 0, //giới tính
          avatar: "", //ảnh đại diện
          birthday: "", //ngày sinh
          phoneNumber: "", //số điện thoại
          email: "", //địa chỉ email
          basicSalary: "", //lương cơ bản
          address: "", //địa chỉ thường trú
          password: "", //mật khẩu
          chatId: "", //id chat
          shopId: "", //id cửa hàng
        },
      };
    case GET_ADMIN:
      const adminInfo = action.admin;
      return {
        ...state,
        admin: {
          adminId: adminInfo.adminId ? adminInfo.adminId : adminInfo.AdminId,
          adminCode: adminInfo.adminCode
            ? adminInfo.adminCode
            : adminInfo.AdminCode,
          iDCardCode: adminInfo.iDCardCode
            ? adminInfo.iDCardCode
            : adminInfo.IDCardCode,
          adminName: adminInfo.adminName
            ? adminInfo.adminName
            : adminInfo.AdminName,
          role: adminInfo.role ? adminInfo.role : adminInfo.Role,
          gender: adminInfo.gender ? adminInfo.gender : adminInfo.Gender,
          avatar: adminInfo.avatar ? adminInfo.avatar : adminInfo.Avatar,
          birthday: adminInfo.birthday
            ? adminInfo.birthday
            : adminInfo.Birthday,
          phoneNumber: adminInfo.phoneNumber
            ? adminInfo.phoneNumber
            : adminInfo.PhoneNumber, //số điện thoại liên hệ
          address: adminInfo.address ? adminInfo.address : adminInfo.Address, //địa chỉ thường trú
          homeTown: adminInfo.homeTown
            ? adminInfo.homeTown
            : adminInfo.HomeTown, //quê quán
          email: adminInfo.email ? adminInfo.email : adminInfo.Email, //địa chỉ email
          basicSalary: adminInfo.basicSalary ? adminInfo.basicSalary : adminInfo.BasicSalary, //lương cơ bản
          password: adminInfo.password
            ? adminInfo.password
            : adminInfo.Password, //mật khẩu
          chatId: adminInfo.chatId ? adminInfo.chatId : adminInfo.ChatId, //id chat
          shopId: adminInfo.shopId ? adminInfo.shopId : adminInfo.ShopId, //id chat
        },
      };
    case CHANGE_PASS:
      const password = action.password;
      return {
        ...state,
        admin: {
          ...state.admin,
          password: password,
        },
      };
    default:
      return state;
  }
};
