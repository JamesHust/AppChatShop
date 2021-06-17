import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../constants/color";
import HomeStack from "./HomeStack";
import CartScreen from "../screens/CartScreen";
import MessageTask from "./MessageStack";
import ProfileStack from "./ProfileStack";
import ShoppingTask from "./ShoppingStack";

//tạo bottom tab cho màn hình
const Tab = createBottomTabNavigator();

const MainTab = () => {
  //Hàm ẩn tab khi vào màn hình chat
  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === "Chat" ||
      routeName === "EditProfile" ||
      routeName === "DetailProduct" ||
      routeName === "Wishlist" ||
      routeName === "MonitorStack" ||
      routeName === "CompleteOrderStack" ||
      routeName === "LoginScreen" ||
      routeName === "SupportScreen" ||
      routeName === "ChangePassScreen"
    ) {
      return false;
    }
    return true;
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLORS.red_13,
        labelStyle: {
          fontSize: 12,
        },
        tabStyle: {
          paddingTop: 10,
          height: 50,
        },
        keyboardHidesTabBar: true,
        style: {
          height: 55,
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "md-home" : "md-home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ShoppingTask"
        component={ShoppingTask}
        options={({ route }) => ({
          title: "Đặt nhanh",
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "md-fast-food" : "md-fast-food-outline"}
              size={24}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: "Giỏ hàng",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "md-cart" : "md-cart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MessageTask"
        component={MessageTask}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          title: "Trò chuyện",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbox" : "chatbox-outline"}
              size={24}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={23} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
