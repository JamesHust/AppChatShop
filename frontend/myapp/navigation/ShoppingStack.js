import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuickOrderScreen from "../screens/QuickOrderScreen";
import DetailProductScreen from "../screens/DetailProductScreen";
import SearchScreen from "../screens/SearchScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo đường dẫn cho màn hình đặt nhanh
const ShoppingTask = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="QuickOrder">
    {/* Màn hình đặt hàng nhanh */}
    <Stack.Screen
      name="QuickOrder"
      component={QuickOrderScreen}
      options={{ header: () => null }}
    />
    {/* Màn hình chi tiết sản phẩm */}
    <Stack.Screen
      name="DetailProduct"
      component={DetailProductScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình tìm kiếm*/}
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
export default ShoppingTask;
