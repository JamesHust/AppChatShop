import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MonitorOrderScreen from "../screens/MonitorOrderScreen";
import DetailMonitorScreen from "../screens/DetailMonitorScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo các đường dẫn cho màn hình trang chủ
const MonitorTask = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="MonitorOrder">
    {/* Màn hình các đơn hàng đang trong tiến trình */}
    <Stack.Screen
      name="MonitorOrder"
      component={MonitorOrderScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    {/* Màn hình chi tiết đơn hàng*/}
    <Stack.Screen
      name="DetailMonitor"
      component={DetailMonitorScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);
export default MonitorTask;
