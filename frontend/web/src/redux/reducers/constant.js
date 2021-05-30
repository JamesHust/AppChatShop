import { GET_CONSTANTS } from "../actions/constant";

const initialState = {
  cates: [],
  gender: [
    //(0-không xác đinh, 1-Nam, 2-Nữ, 3- Khác)
    {
      typeGender: 0,
      genderName: "Không xác định",
    },
    {
      typeGender: 1,
      genderName: "Nam",
    },
    {
      typeGender: 2,
      genderName: "Nữ",
    },
    {
      typeGender: 3,
      genderName: "Khác",
    },
  ],
  role: [
    //0-Chưa xác định, 1-Chủ cửa hàng, 2-Nhân viên
    {
      typeRole: 0,
      roleName: "Chưa xác định",
    },
    {
      typeRole: 1,
      roleName: "Chủ cửa hàng",
    },
    {
      typeRole: 2,
      roleName: "Nhân viên",
    },
  ]
};

export const constant = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONSTANTS:
      const listCate = action.cates;
      return {
        ...state,
        cates: listCate,
      };
    default:
      return state;
  }
};
