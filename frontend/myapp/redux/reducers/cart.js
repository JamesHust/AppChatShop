import {
  GET_CART,
  REMOVE_CART,
  ADD_QUICK_CART,
  REMOVE_QUICK_CART,
  ADD_SELECTED_PROD,
  ADD_ALL_SELECTED_PROD,
  REMOVE_SELECTED_PROD,
  REMOVE_ALL_SELECTED,
} from "../actions/cart";

const initialState = {
  cart: [],
  quickCart: [],
  selectedProductInCart: [],
  totalPayment: 0,
  ship: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      const cart = action.cart;
      const selectedList = state.selectedProductInCart;
      if (cart.length > 0 && selectedList.length > 0) {
        const rsUpdate = updatePaymentAndShip(selectedList, cart);
        return {
          ...state,
          cart: cart,
          totalPayment: rsUpdate.sumPay,
          ship: rsUpdate.shipUpdate,
        };
      }
      return {
        ...state,
        cart: cart,
      };
    case REMOVE_CART:
      return;
    case ADD_QUICK_CART:
      return;
    case REMOVE_QUICK_CART:
      return;
    case ADD_SELECTED_PROD:
      const idProd = action.idProd;
      const selectedListA = state.selectedProductInCart;
      const cartA = state.cart;
      if (idProd) {
        selectedListA.push(idProd);
        if (cartA.length > 0 && selectedListA.length > 0) {
          const rsUpdateA = updatePaymentAndShip(selectedListA, cartA);
          return {
            ...state,
            totalPayment: rsUpdateA.sumPay,
            ship: rsUpdateA.shipUpdate,
          };
        }
      }
      return state;
    case ADD_ALL_SELECTED_PROD:
      const listId = action.listId;
      const cartAA = state.cart;
      if (cartAA.length > 0 && listId.length > 0) {
        const rsUpdateAA = updatePaymentAndShip(listId, cartAA);
        return {
          ...state,
          selectedProductInCart: listId,
          totalPayment: rsUpdateAA.sumPay,
          ship: rsUpdateAA.shipUpdate,
        };
      }
      return state;
    case REMOVE_SELECTED_PROD:
      const prodId = action.prodId;
      const selectedListB = state.selectedProductInCart;
      const index = selectedListB.findIndex((item) => item == prodId);
      if (index < 0) {
        return state;
      } else {
        selectedListB.splice(index, 1);
        const cartB = state.cart;

        if (cartB.length > 0 && selectedListB.length > 0) {
          const rsUpdateB = updatePaymentAndShip(selectedListB, cartB);
          return {
            ...state,
            totalPayment: rsUpdateB.sumPay,
            ship: rsUpdateB.shipUpdate,
          };
        } else {
          return {
            ...state,
            totalPayment: 0,
            ship: 0,
          };
        }
      }
    case REMOVE_ALL_SELECTED:
      return {
        ...state,
        selectedProductInCart: [],
        totalPayment: 0,
        ship: 0,
      };
  }
  return state;
};

const updatePaymentAndShip = (selectedList, cart) => {
  let sumPay = 0;
  // Tính tổng tiền tất cả sản phẩm trong giỏ
  selectedList.forEach((i) => {
    cart.forEach((a) => {
      const index = a.findIndex((b) => b.productId == i);
      if (index >= 0) {
        sumPay += +a[index].productAmount * +a[index].productPrice;
      }
    });
  });

  // Lấy thông tin chi tiết từng sản phẩm được chọn vào 1 mảng
  let list = [];
  selectedList.forEach((i) => {
    cart.forEach((a) => {
      const checkProd = a.find((b) => b.productId == i);
      if (checkProd) {
        list.push(checkProd);
      }
    });
  });
  const listShop = list.map((i) => i.shopName);
  // Lọc số cửa hàng khác nhau của sản phẩm => tính ra số lượng cửa hàng đg đc chọn
  const kq = listShop.filter((val, index) => listShop.indexOf(val) == index);

  const shipUpdate = +kq.length * 15000;
  sumPay += shipUpdate;
  return { sumPay, shipUpdate };
};
