import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import QuickOrderScreen from "../screens/QuickOrderScreen";
import UserScreen from "../screens/UserScreen";

//tạo bottom tab cho màn hình
const Tab = createMaterialBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: () => (
            <AntDesign name="home" size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="QuickOrderScreen"
        component={QuickOrderScreen}
        options={{
          tabBarLabel: "Đặt nhanh",
          tabBarIcon: () => (
            <AntDesign name="shoppingcart" size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          tabBarLabel: "Trò chuyện",
          tabBarIcon: () => (
            <Ionicons name="chatbox-outline" size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          tabBarLabel: "Người dùng",
          tabBarIcon: () => (
            <AntDesign name="user" size={24} color="white" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MainTab;