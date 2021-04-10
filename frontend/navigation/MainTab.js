import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";
import QuickOrderScreen from "../screens/QuickOrderScreen";
import UserScreen from "../screens/UserScreen";
import ChatScreen from "../screens/ChatScreen";
import Constants from "expo-constants";

//tạo bottom tab cho màn hình
const Tab = createMaterialBottomTabNavigator();
// const Tab = createBottomTabNavigator();
//tạo stack đường dẫn cho màn hình trò chuyện
const Stack = createStackNavigator();

//khai báo đường dẫn cho màn hình tro chuyện
const MessageTask = () => (
  // Khai báo đường dẫn cho màn hình tương ứng
  <Stack.Navigator initialRouteName="ChatBoard">
    {/* Màn hình bảng trò chuyện */}
    <Stack.Screen
      name="ChatBoard"
      component={MessageScreen}
      options={{ header: () => null }}
    />
    {/* Màn hình trò chuyện */}
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={() => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);

const MainTab = () => {
  //Hàm ẩn tab khi vào màn hình chat
  const getTabBarVisibility = (route) => {
    console.log(route.name);
  };
  return (
    <Tab.Navigator
      barStyle={{
        ...{
          backgroundColor: COLORS.light,
          borderColor: COLORS.dark,
          borderTopWidth: 0.5,
        },
      }}
      shifting={false}
      activeColor={COLORS.orange_14}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "md-home" : "md-home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="QuickOrderScreen"
        component={QuickOrderScreen}
        options={{
          title: "Đặt nhanh",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "md-fast-food" : "md-fast-food-outline"}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MessageTask"
        component={MessageTask}
        options={({ route }) => ({
          title: "Trò chuyện",

          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbox" : "chatbox-outline"}
              size={23}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
