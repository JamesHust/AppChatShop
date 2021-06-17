import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import COLORS from "../constants/color";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import orders from "../data/mission_orders";
import ListMissionOrder from "../components/ListMissionOrder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import configData from "../config/config.json";

const HomeScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [missions, setMissions] = useState(orders); //danh sách nhiệm vụ
  const dispatch = useDispatch();
  const shipper = useSelector((state) => state.authReducer.shipper);

  // Lấy danh sách nhiệm vụ
  const getMissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const shipperId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `${configData.SERVER_URL}delivery/${shipperId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setMissions(resData.data);
          setIsLoading(false);
          return;
        default:
          setMissions(null);
          setIsLoading(false);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getMissions(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, []);

  // Lấy danh sách nhiệm vụ mỗi khi nhận đơn hàng giao mới
  useEffect(() => {
    const getReceivedMission = navigation.addListener("focus", () => {
      getMissions();
    });
    return getReceivedMission;
  }, [navigation]);

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
        <View style={{ flex: 1 }}>
          <ListMissionOrder
            data={missions}
            showsVerticalScrollIndicator={false}
          />
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
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 15,
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
});

export default HomeScreen;
