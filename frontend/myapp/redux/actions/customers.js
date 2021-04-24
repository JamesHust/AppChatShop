//Khai báo các type của customerAction
export const CREATE_ACCOUNT_CUS = "CREATE_ACCOUNT_CUS";
export const UPDATE_ACCOUNT_CUS = "UPDATE_ACCOUNT_CUS";
export const GET_CUSTOMERS = "GET_CUSTOMERS";
export const GET_CUSTOMER = "GET_CUSTOMER";
export const LOGIN_CUSTOMER = "LOGIN_CUSTOMER";


//Hàm action lấy toàn bộ danh sách khách hàng
export const fetchCustomers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://192.168.1.125:3000/customers");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      console.log(err);
    }
  };
};

/**
 * Lấy chi tiết thông tin khách hàng theo id
 * @param {*} customerId Id khách hàng
 * @returns 
 */
export const fetchCustomerById = (customerId) => {
  return async (dispatch) => {
    try{
      const response = await fetch(`http://192.168.1.125:3000/customers/${customerId}`);
      if (response.status != 200) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
    }catch(err){
      console.log(err);
    }
  };
};