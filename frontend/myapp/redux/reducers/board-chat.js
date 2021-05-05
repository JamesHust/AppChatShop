import { GET_BOARD_CHAT } from "../actions/board-chat";

const initialState = {
  boardChat: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BOARD_CHAT:
      const boardChat = action.boardChat;
      return {
        ...state,
        boardChat: boardChat,
      };
  }
  return state;
};
