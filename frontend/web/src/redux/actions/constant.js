import { SERVER_URL } from "src/config/config";

//Khai báo các type của constantAction
export const GET_CONSTANTS = "GET_CONSTANTS";

/**
 * Hàm action lấy toàn bộ constants
 * @returns
 */
export const getConstants = () => {
  return async (dispatch) => {
    try {
      //thực hiện đăng nhập, gửi request lên server để check tài khoản
      const response = await fetch(`${SERVER_URL}categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if(response.status === 200){
        const resData = await response.json();
        dispatch({ type: GET_CONSTANTS, cates: resData.data });
      }else{
        alert("Lỗi hệ thống không lấy được dữ liệu dùng chung.");
      }
    } catch (err) {
      alert(`Lỗi không lấy được dữ liệu dùng chung : ${err}.`);
      throw err;
    }
  };
};
