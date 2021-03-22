import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";//thư viện tương tác với Storage
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

// Tạo đường dẫn cho các screen
const Stack = createStackNavigator();

//Component để khởi tạo các đường dẫn Stack
const AuthStack = () => {
  //khởi tạo các state
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);//state kiểm tra khi mới bắt đầu vào app
  let routeName;//biến để check chọn đường dẫn phù hợp

  //luôn kiểm tra storage xem alreadyLaunched đã có giá trị chưa,
  //nếu có thì bỏ qua bước onboarding
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = "Onboarding";
  } else {
    routeName = "Onboarding";
  }

  return (
    // Khai báo đường dẫn cho màn hình tương ứng
    <Stack.Navigator initialRouteName={routeName}>
      {/* Màn hình carosel */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
      {/* Màn hình đăng nhập */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      {/* Màn hình trang chủ */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
