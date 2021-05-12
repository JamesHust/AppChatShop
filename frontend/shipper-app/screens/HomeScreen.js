import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import COLORS from "../constants/color";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [missions, setMissions] = useState([]); //danh sách nhiệm vụ

  // Component header
  const Header = () => {
    return (
      <View style={styles.containerHeader}>
        {/* Toggle Menu */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons
            name="menu"
            size={30}
            color={COLORS.light}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        {/* Ngày tháng hiện tại */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textDate}>12 Tháng 5</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Nội dung form đăng nhập */}
        <Animatable.View
          animation="fadeInUpBig"
          style={[
            styles.footer,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </Animatable.View>
      </SafeAreaView>
    );
  }

  // Xét trường hợp không có nhiệm vụ nào
  if (!missions || missions.length <= 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Nội dung form đăng nhập */}
        <View
          style={[
            styles.footer,
            {
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 100,
            },
          ]}
        >
          {/* Nội dung */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../assets/sun.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Tất cả rõ ràng</Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Không có nhiệm vụ
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.red_13} />
      {/* Header */}
      <Header />
      {/* Nội dung form đăng nhập */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: COLORS.light,
          },
        ]}
      >
        <Text>Test</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red_13,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    marginTop: 15
  },
  iconMenu: {
    padding: 10,
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    paddingVertical: 30,
  },
  textDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.light,
  },
  titlePage:{
    marginTop: 15,
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.dark
  }
});

export default HomeScreen;
