//Khai báo các type của authAction
export const SAVE_TOKEN = "SAVE_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";
export const GET_ADMIN = "GET_ADMIN";
export const CHANGE_PASS = "CHANGE_PASS";

/**
 * Hàm action lưu token khi đăng nhập
 * @returns
 */
export const storageToken = (data) => {
  return async (dispatch) => {
    try {
      const token = data.accessToken;
      const admin = data.admin;
      // Lưu token vào storage
      localStorage.setItem("token", token);
      return dispatch({ type: SAVE_TOKEN, admin: admin, token: token });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm lấy lại dữ liệu admin
 * @param {*} data 
 * @returns 
 */
export const getAdmin = (data) => {
  return async (dispatch) => {
    try {
      const token = data.token;
      const adminId = data.adminId;
      const response = await fetch(
        `http://192.168.1.125:3000/api/admins/${adminId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );
      if(response.status === 200){
        const resData = await response.json();
        console.log(resData.data);
        dispatch({ type: GET_ADMIN, admin: resData.data });
      }else{
        alert("Có lỗi xảy ra khi lấy lại dữ liệu tài khoản.")
      }
      return;
    } catch (err) {
      throw err;
    }
  };
};

export const changePass = (pass) => {
  return async (dispatch) => {
    try {
      const password = pass;
      // Lưu token vào storage
      return dispatch({ type: CHANGE_PASS, password: password });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm đăng xuất
 * @returns
 */
export const logout = () => {
  return async (dispatch) => {
    try {
      const userToken = localStorage.getItem("token");
      // Thực hiện xóa token trong cơ sở dữ liệu
      const response = await fetch("http://192.168.1.125:3000/api/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": userToken,
        },
      });
      switch (response.status) {
        case 200:
          localStorage.removeItem("token");
          dispatch({ type: REMOVE_TOKEN });
          break;
        case 403:
          alert("Chưa xác thực được người dùng");
          break;
        default:
          alert("Lỗi hệ thống");
          break;
      }
    } catch (err) {
      throw err;
    }
  };
};
