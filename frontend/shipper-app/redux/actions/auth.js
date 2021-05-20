import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { Alert } from "react-native";

//Khai báo các type của authAction
export const SAVE_TOKEN = "SAVE_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";

/**
 * Hàm action lưu token khi đăng nhập
 * @returns
 */
export const storageToken = (data) => {
  return async (dispatch) => {
    try {
      const token = data.accessToken;
      const shipper = data.user ? data.user: data.shipper;
      // Lưu token vào storage
      await AsyncStorage.setItem("userToken", token);
      const shipperId = shipper.shipperId ? shipper.shipperId: shipper.ShipperId
      await AsyncStorage.setItem("userId", shipperId);
      return dispatch({ type: SAVE_TOKEN, shipper: shipper, token: token });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm action xử lý sự kiện khi đăng xuất
 * Xóa token trong DB và storage
 * @returns
 */
export const logout = () => {
  return async (dispatch) => {
    try {
      console.log("ok");
      const userToken = await AsyncStorage.getItem("userToken");
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
          await AsyncStorage.removeItem("userToken");
          return dispatch({ type: REMOVE_TOKEN });
        case 403:
          Alert.alert("goFAST", "Chưa xác thực được người dùng", [
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      throw err;
    }
  };
};
