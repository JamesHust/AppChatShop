import {
  CREATE_ACCOUNT_CUS,
  UPDATE_ACCOUNT_CUS,
  GET_CUSTOMERS,
  GET_CUSTOMER,
  LOGIN_CUSTOMER,
} from "../actions/customers";
import Customer from "../../models/customer";

const initialState = {
  listCustomer: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case CREATE_ACCOUNT_CUS:
    //   return;
    // case UPDATE_ACCOUNT_CUS:
    //   return;
    case GET_CUSTOMERS:
      return state;
    // case GET_CUSTOMER:
    //   return;
    // case LOGIN_CUSTOMER:
    //   return;
    // case CREATE_PRODUCT:
    //   const newProduct = new Product(
    //     action.productData.id,
    //     "u1",
    //     action.productData.title,
    //     action.productData.imageUrl,
    //     action.productData.description,
    //     action.productData.price
    //   );
    //   return {
    //     ...state,
    //     availableProducts: state.availableProducts.concat(newProduct),
    //     userProducts: state.userProducts.concat(newProduct),
    //   };
  }
  return state;
};
