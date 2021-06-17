import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { showToast } from "../../utils/Common";
import configData from "../../config/config.json";

//Khai báo các type của wishlistAction
export const GET_WISHLIST = "GET_WISHLIST";

/**
 * Lấy danh sách sản phẩm yêu thích
 * @param {*} customerId Id khách hàng
 * @param {*} token
 * @returns
 */
export const getWishlist = (customerId, token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${configData.SERVER_URL}reviews/products/${customerId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          if (resData.data) {
            // console.log(resData.data);
            return dispatch({ type: GET_WISHLIST, wishlist: resData.data });
          } else {
            dispatch({ type: GET_WISHLIST, wishlist: [] });
          }
        case 404:
          return dispatch({ type: GET_WISHLIST, wishlist: [] });
        default:
          showToast("Lấy danh sách yêu thích thất bại");
          return;
      }
    } catch (err) {
      throw err;
    }
  };
};

