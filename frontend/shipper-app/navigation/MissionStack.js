import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailMissionScreen from "../screens/DetailMissionScreen";

// Tạo đường dẫn cho các screen
const Stack = createStackNavigator();

//Component để khởi tạo các đường dẫn Stack
const MissionStack = () => {
  return (
    // Khai báo đường dẫn cho màn hình tương ứng
    <Stack.Navigator initialRouteName="Home">
      {/* Màn hình trang chủ - danh sách nhiệm vụ đã nhận */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null }}
      />
      {/* Màn hình chi tiết đơn hàng đã nhận */}
      <Stack.Screen
        name="DetailMission"
        component={DetailMissionScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default MissionStack;
