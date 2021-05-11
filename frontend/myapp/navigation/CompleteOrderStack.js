import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CompleteOrderScreen from "../screens/CompleteOrderScreen";
import DetailCompleteOrder from "../screens/DetailCompleteOrder";
import DetailProductScreen from "../screens/DetailProductScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo các đường dẫn cho màn hình trang chủ
const CompleteOrderStack = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="CompleteOrder">
    {/* Màn hình các đơn hàng đã hoàn thành hoặc đã hủy */}
    <Stack.Screen
      name="CompleteOrder"
      component={CompleteOrderScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình chi tiết đơn hàng đã hoàn thành*/}
    <Stack.Screen
      name="DetailComplete"
      component={DetailCompleteOrder}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình chi tiết sản phẩm */}
    <Stack.Screen
      name="DetailProduct"
      component={DetailProductScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
export default CompleteOrderStack;
