import { GET_WISHLIST } from "../actions/wishlist";

const initialState = {
  wishlist: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WISHLIST:
      const wishlist = action.wishlist;
      return {
        ...state,
        wishlist: wishlist,
      };
  }
  return state;
};
