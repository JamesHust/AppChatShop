import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import MainDrawer from "./MainDrawer";

// Tạo đường dẫn cho các screen
const Stack = createStackNavigator();

//Component để khởi tạo các đường dẫn Stack
const AuthStack = () => {
  return (
    // Khai báo đường dẫn cho màn hình tương ứng
    <Stack.Navigator initialRouteName="Login">
      {/* Màn hình đăng nhập */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      {/* Màn hình trang chủ */}
      <Stack.Screen
        name="MainDrawer"
        component={MainDrawer}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
