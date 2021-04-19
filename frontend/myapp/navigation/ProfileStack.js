import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserScreen from "../screens/UserScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import WishlistScreen from "../screens/WishlistScreen";
import MonitorOrderScreen from "../screens/MonitorOrderScreen";
import LoginScreen from "../screens/LoginScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo đường dẫn cho màn hình tài khoản
const ProfileTask = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="UserScreen">
    {/* Màn hình thông tin tài khoản */}
    <Stack.Screen
      name="UserScreen"
      component={UserScreen}
      options={{ header: () => null }}
    />
    {/* Màn hình cập nhật thông tin tài khoản */}
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình danh sách sản phẩm yêu thích */}
    <Stack.Screen
      name="Wishlist"
      component={WishlistScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình theo dõi đơn hàng */}
    <Stack.Screen
      name="MonitorOrder"
      component={MonitorOrderScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình đăng nhập */}
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
export default ProfileTask;
