import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import SmallButton from "../components/SmallButton";

//Trang giới thiệu khi mới dùng app
const OnboardingScreen = ({ navigation }) => {
  //Hàm xử lý sự kiện khi đã done hết qua các onboarding
  const onDone = () => navigation.navigate("Login");
  return (
    // Tạo slider
    <Onboarding
      nextLabel="Tiếp"
      skipLabel="Bỏ qua"
      onSkip={() => navigation.navigate("Login")}
      DoneButtonComponent={() => (
        <SmallButton title="Đăng nhập" onPress={onDone} />
      )}
      bottomBarColor="#fac1b6"
      pages={[
        //Mỗi slide
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../assets/banner/banner-9.jpg")}
              style={styles.imgOnboarding}
            />
          ),
          title: "Giao hàng thông minh",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        //Mỗi slide
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../assets/banner/banner-10.jpg")}
              style={styles.imgOnboarding}
            />
          ),
          title: "Đặt hàng đơn giản",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        //Mỗi slide
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../assets/banner/banner-2.jpg")}
              style={styles.imgOnboarding}
            />
          ),
          title: "Nhận hàng tận tay",
          subtitle: "Done with React Native Onboarding Swiper",
        },
      ]}
    />
  );
};

//Nơi style cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  //Css cho ảnh
  imgOnboarding: {
    width: 500,
    height: 300,
  },
});

export default OnboardingScreen;
