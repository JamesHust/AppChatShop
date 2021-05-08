import {
  GET_CART,
  REMOVE_CART,
  ADD_UPDATE_QUICK_CART,
  REMOVE_QUICK_CART,
  REMOVE_ALL_QUICK_CART,
  ADD_SELECTED_PROD,
  ADD_ALL_SELECTED_PROD,
  REMOVE_SELECTED_PROD,
  REMOVE_ALL_SELECTED,
} from "../actions/cart";

const initialState = {
  cart: [],
  quickCart: [],
  totalPaymentQuickCart: 0,
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
    case ADD_UPDATE_QUICK_CART:
      const product = action.product;
      const listQuickCart = state.quickCart;
      const indexProd = listQuickCart.findIndex(
        (i) => i.productId === product.productId
      );
      if (indexProd > -1) {
        //cập nhật nếu đã có sản phẩm
        listQuickCart.splice(indexProd, 1, product);
      } else {
        //thêm mới nếu chưa có sản phẩm
        listQuickCart.push(product);
      }
      // Tính lại tổng tiền giỏ hàng nhanh
      const paymentQuickCartA = updatePaymentQuickCart(listQuickCart);
      return {
        ...state,
        quickCart: listQuickCart,
        totalPaymentQuickCart: paymentQuickCartA
      };
    case REMOVE_QUICK_CART:
      const prodID = action.productId;
      const listQuickCartQ = state.quickCart;
      const indexProdQ = listQuickCartQ.findIndex(
        (i) => i.productId === prodID
      );
      if (indexProdQ > -1) {
        //cập nhật nếu đã có sản phẩm
        listQuickCartQ.splice(indexProdQ, 1)
      } 
      // Tính lại tổng tiền giỏ hàng nhanh
      const paymentQuickCartQ = updatePaymentQuickCart(listQuickCartQ);
      return {
        ...state,
        quickCart: listQuickCartQ,
        totalPaymentQuickCart: paymentQuickCartQ
      };
    case REMOVE_ALL_QUICK_CART:
      return {
        ...state,
        quickCart: [],
        totalPaymentQuickCart: 0
      };
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

// Hàm tính lại số tiền giỏ thường và tiền ship
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

// Hàm tính lại tổng số tiền của giỏ hàng nhanh
const updatePaymentQuickCart = (data) => {
  let sumQuickCart = 0;
  if (data.length > 0) {
    data.forEach((item) => {
      sumQuickCart += +item.purchasePrice * +item.productAmount;
    });
    if(sumQuickCart > 0){
      sumQuickCart += 15000;//phí ship cố định khi giao cho từng cửa hàng
    }
  }
  return sumQuickCart
};
