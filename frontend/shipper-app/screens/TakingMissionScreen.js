import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import COLORS from "../constants/color";
import * as Animatable from "react-native-animatable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import QueueOrder from "../components/QueueOrder";
import order from "../data/queue_order";

const TakingMissionScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [mission, setMission] = useState(null); //danh sách nhiệm vụ

  useEffect(() => {
    setMission(order);
  }, []);

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
          {/* search-bar */}
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={21} color={COLORS.dark} />
              <TextInput
                placeholder="Tìm kiếm mã hoặc tên sản phẩm"
                style={{ marginLeft: 5 }}
              />
            </View>
            <View style={styles.sortBtn}>
              <MaterialIcons name="sort" size={23} color={COLORS.light} />
            </View>
          </View>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </Animatable.View>
      </SafeAreaView>
    );
  }

  // Xét trường hợp không có nhiệm vụ nào
  if (!mission) {
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
            },
          ]}
        >
          {/* search-bar */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.searchContainer}>
              <TextInput placeholder="Tìm kiếm theo mã đơn giao hàng..." />
            </View>
            <View style={styles.sortBtn}>
              <Ionicons name="search" size={21} color={COLORS.light} />
            </View>
          </View>
          {/* Nội dung */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <Image
              source={require("../assets/tracking.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Tìm kiếm ngay</Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                width: 280,
              }}
            >
              Vui lòng nhập mã đơn giao để nhận đơn hàng
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
        {/* search-bar */}
        <View style={{ flexDirection: "row" }}>
          <View style={styles.searchContainer}>
            <TextInput placeholder="Tìm kiếm theo mã đơn giao hàng..." />
          </View>
          <View style={styles.sortBtn}>
            <Ionicons name="search" size={21} color={COLORS.light} />
          </View>
        </View>
        {/* Phần hiển thị đơn hàng tìm kiếm theo mã giao hàng */}
        <View>
          <QueueOrder data={mission}/>
        </View>
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
    marginTop: 15,
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
  titlePage: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.grey_3,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  sortBtn: {
    marginLeft: 5,
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.red_13,
    borderRadius: 15,
  },
  
});

export default TakingMissionScreen;
