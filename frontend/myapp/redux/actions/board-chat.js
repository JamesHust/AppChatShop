import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { showToast } from "../../utils/Common";
import RoomChat from "../../models/room-chat";

//Khai báo các type của boardChatAction
export const GET_BOARD_CHAT = "GET_BOARD_CHAT";

export const getBoardChat = (customerId, areaId, token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://192.168.1.125:3000/api/messages/board?customerId=${customerId}&areaId=${areaId}`,
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
          const boardChat = [];
          resData.data.forEach((room) => {
            boardChat.push(
              new RoomChat(
                room.roomId,
                room.shopId,
                room.shopName,
                room.avatar,
                room.activeStatus,
                room.finalTextMessage
              )
            );
          });
          return dispatch({ type: GET_BOARD_CHAT, boardChat: boardChat });
        case 404:
          return dispatch({ type: GET_BOARD_CHAT, wishlist: [] });
        default:
          showToast("Lấy bảng chat thất bại!");
          return;
      }
    } catch (err) {
      throw err;
    }
  };
};

