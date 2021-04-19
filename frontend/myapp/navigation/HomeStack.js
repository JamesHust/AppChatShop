import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import DetailProductScreen from "../screens/DetailProductScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo các đường dẫn cho màn hình trang chủ
const HomeTask = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="HomeScreen">
    {/* Màn hình trang chủ */}
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ header: () => null }}
    />
    {/* Màn hình tìm kiếm*/}
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình chi tiết sản phẩm*/}
    <Stack.Screen
      name="DetailProduct"
      component={DetailProductScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
export default HomeTask;
