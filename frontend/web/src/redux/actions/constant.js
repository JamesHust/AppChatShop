//Khai báo các type của constantAction
export const GET_CONSTANTS = "GET_CONSTANTS";

/**
 * Hàm action lấy toàn bộ constants
 * @returns
 */
export const getConstants = () => {
    console.log("ok");
  return async (dispatch) => {
    try {
      //thực hiện đăng nhập, gửi request lên server để check tài khoản
      const response = await fetch("http://192.168.1.125:3000/api/categories", {
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
