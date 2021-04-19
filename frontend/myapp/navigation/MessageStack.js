import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MessageScreen from "../screens/MessageScreen";
import ChatScreen from "../screens/ChatScreen";

//tạo stack đường dẫn
const Stack = createStackNavigator();

//khai báo đường dẫn cho màn hình trò chuyện
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
export default MessageTask;
